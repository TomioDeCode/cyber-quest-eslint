/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, FileQuestion, RefreshCw, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CreateSoalDialog } from "@/components/common/CreateSoalDialog";
import { DeleteSoalDialog } from "@/components/common/DeleteSoalDialog";
import { SoalCard } from "@/components/core/SoalCard";
import { Soal, UpdateMessage } from "@/types/SoalsData";
import Cookies from "js-cookie";
import { useSession } from "next-auth/react";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Checkbox } from "../ui/checkbox";

const COOKIE_EXPIRY_DAYS = 7;
const TOAST_DURATION = 3000;
const UPDATE_MESSAGE_TIMEOUT = 2000;

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface SoalState {
  soals: Soal[];
  originalSoals: Soal[];
  loading: boolean;
  error: string | null;
  editingId: string | null;
  editUrl: string;
  updateMessage: UpdateMessage;
  refreshing: boolean;
  deleteDialogOpen: boolean;
  deletingId: string | null;
  deleteError: string | null;
}

const SoalManager = () => {
  const { data: sessionData } = useSession();
  const [solvedSoals, setSolvedSoals] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const availableCategories = [
    "cryptography",
    "forensics",
    "reverse",
    "general",
    "web",
  ];

  const MultiSelectCategories = () => {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[200px] justify-between text-center"
          >
            {selectedCategories.length > 0 ? (
              <>
                Selected
                {selectedCategories.length > 2
                  ? "..."
                  : `: ${selectedCategories.length}`}
              </>
            ) : (
              "Select Categories"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="end">
          <div className="space-y-2 p-4">
            {availableCategories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={category}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedCategories([...selectedCategories, category]);
                    } else {
                      setSelectedCategories(
                        selectedCategories.filter((item) => item !== category)
                      );
                    }
                  }}
                />
                <label
                  htmlFor={category}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </label>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  const { toast } = useToast();
  const isAdmin = sessionData?.user.role === "admin";

  const [state, setState] = useState<SoalState>(() => ({
    soals: initializeSoals(),
    originalSoals: [],
    loading: true,
    error: null,
    editingId: localStorage.getItem("editingId"),
    editUrl: localStorage.getItem("editUrl") || "",
    updateMessage: { type: "", message: "" },
    refreshing: false,
    deleteDialogOpen: false,
    deletingId: null,
    deleteError: null,
  }));

  const updateState = useCallback((updates: Partial<SoalState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateFavoriteCookie = useCallback(
    (id: string, isFavorite: boolean) => {
      if (isFavorite) {
        Cookies.set(`favorite_${id}`, "true", { expires: COOKIE_EXPIRY_DAYS });
      } else {
        Cookies.remove(`favorite_${id}`);
      }
    },
    []
  );

  const showSuccessToast = useCallback(
    (message: string) => {
      toast({
        title: "Success",
        description: message,
        duration: TOAST_DURATION,
      });
    },
    [toast]
  );

  const handleError = useCallback(
    (error: unknown, errorKey?: keyof SoalState) => {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";

      if (errorKey) {
        updateState({ [errorKey]: errorMessage });
      }

      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
        duration: TOAST_DURATION,
      });
    },
    [toast, updateState]
  );

  const api = useMemo(
    () => ({
      async fetchSoals() {
        try {
          const params = new URLSearchParams();
          params.append("excludeSolved", "true");

          const response = await fetch(`/api/soals?${params.toString()}`);

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch soals");
          }

          const data: ApiResponse<Soal[]> = await response.json();

          if (data.success && data.data) {
            const soalsWithFavorites = data.data.map((soal) => ({
              ...soal,
              isFavorite: Cookies.get(`favorite_${soal.id}`) === "true",
            }));
            updateState({
              soals: soalsWithFavorites,
              originalSoals: soalsWithFavorites,
              error: null,
              loading: false,
            });
          } else {
            updateState({
              soals: [],
              originalSoals: [],
              error: data.message || null,
              loading: false,
            });
          }
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "Failed to fetch soals";
          handleError(errorMessage);
          updateState({
            soals: [],
            originalSoals: [],
            error: errorMessage,
            loading: false,
          });
        }
      },

      async toggleFavorite(id: string, currentStatus: boolean) {
        const previousSoals = [...state.soals];
        const optimisticUpdate = state.soals.map((soal) =>
          soal.id === id ? { ...soal, isFavorite: !currentStatus } : soal
        );

        updateState({ soals: optimisticUpdate });
        updateFavoriteCookie(id, !currentStatus);

        try {
          const response = await fetch(`/api/soals/${id}/favorite/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isFavorite: !currentStatus }),
          });

          if (!response.ok) {
            throw new Error(
              (await response.json()).message ||
                "Failed to update favorite status"
            );
          }

          const { success, data } = await response.json();
          if (success && data) {
            const newSoals = state.soals.map((soal) =>
              soal.id === id ? { ...soal, isFavorite: data.isFavorite } : soal
            );
            updateState({ soals: newSoals });
            updateFavoriteCookie(id, data.isFavorite);
          }
        } catch (error) {
          updateState({ soals: previousSoals });
          updateFavoriteCookie(id, currentStatus);
          handleError(error);
        }
      },

      async deleteSoal(id: string) {
        try {
          const response = await fetch(`/api/soals/${id}/delete`, {
            method: "DELETE",
          });
          const data: ApiResponse<void> = await response.json();

          if (data.success) {
            Cookies.remove(`favorite_${id}`);
            updateState({
              soals: state.soals.filter((soal) => soal.id !== id),
              deleteError: null,
              deleteDialogOpen: false,
              deletingId: null,
            });
            showSuccessToast("Soal deleted successfully");
          } else {
            throw new Error(data.error || "Failed to delete soal");
          }
        } catch (err) {
          handleError(err, "deleteError");
        }
      },

      async isSubmitFlag(userId: string) {
        try {
          const response = await fetch(
            `/api/soals/solved-soals?userId=${userId}`
          );
          const data = await response.json();
          const solved = setSolvedSoals(data.map((soal: Soal) => soal.id));

          return solved;
        } catch (error) {
          console.error(error);
        }
      },

      async updateSoal(id: string) {
        try {
          const response = await fetch(`/api/soals/${id}/update`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: state.editUrl }),
          });

          const data: ApiResponse<void> = await response.json();

          if (data.success) {
            const updatedSoals = state.soals.map((soal) =>
              soal.id === id ? { ...soal, url: state.editUrl } : soal
            );

            updateState({
              soals: updatedSoals,
              updateMessage: {
                type: "success",
                message: "URL updated successfully",
              },
            });

            showSuccessToast("URL updated successfully");

            setTimeout(() => {
              updateState({
                editingId: null,
                editUrl: "",
                updateMessage: { type: "", message: "" },
              });
            }, UPDATE_MESSAGE_TIMEOUT);
          } else {
            throw new Error(data.message || "Failed to update URL");
          }
        } catch (err) {
          handleError(err, "updateMessage");
        }
      },

      async submitFlag(soalId: string, flag: string) {
        try {
          const response = await fetch("/api/soals/submit-flag", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ soalId, flag }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error);
          }

          showSuccessToast("Flag submitted successfully");

          if (sessionData?.user.id) {
            await Promise.all([
              api.fetchSoals(),
              api.isSubmitFlag(sessionData.user.id),
            ]);
          }
          return data;
        } catch (error) {
          handleError(error);
          throw error;
        }
      },
    }),
    [
      updateState,
      handleError,
      state.soals,
      state.editUrl,
      updateFavoriteCookie,
      showSuccessToast,
      sessionData?.user.id,
    ]
  );

  useEffect(() => {
    api.fetchSoals();
  }, []);

  useEffect(() => {
    localStorage.setItem("soals", JSON.stringify(state.soals));
  }, []);

  useEffect(() => {
    if (state.editingId) {
      localStorage.setItem("editingId", state.editingId);
    } else {
      localStorage.removeItem("editingId");
    }
  }, []);

  useEffect(() => {
    if (state.editUrl) {
      localStorage.setItem("editUrl", state.editUrl);
    } else {
      localStorage.removeItem("editUrl");
    }
  }, []);

  useEffect(() => {
    if (sessionData?.user.id) {
      api.isSubmitFlag(sessionData.user.id);
    }
  }, []);

  const filterSoals = useCallback(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase();
    let filteredResults = [...state.originalSoals];

    if (trimmedQuery) {
      filteredResults = filteredResults.filter((soal) =>
        soal.soal.toLowerCase().includes(trimmedQuery)
      );
    }

    if (selectedCategories.length > 0) {
      filteredResults = filteredResults.filter((soal) => {
        const soalCategories =
          soal.category?.split(",").map((cat) => cat.trim()) || [];
        return selectedCategories.some((selectedCat) =>
          soalCategories.includes(selectedCat)
        );
      });
    }

    updateState({ soals: filteredResults });
  }, [searchQuery, selectedCategories, state.originalSoals, updateState]);

  const handleSearchClick = useCallback(() => {
    filterSoals();
  }, [filterSoals]);

  const handleTrimNull = useCallback(() => {
    if (!searchQuery.trim() && selectedCategories.length === 0) {
      updateState({ soals: state.originalSoals });
    } else {
      filterSoals();
    }
  }, [
    searchQuery,
    selectedCategories,
    state.originalSoals,
    updateState,
    filterSoals,
  ]);

  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleTrimNull();
      }
    },
    [handleTrimNull]
  );

  useEffect(() => {
    if (state.originalSoals.length > 0) {
      filterSoals();
    }
  }, [selectedCategories, filterSoals, state.originalSoals]);

  const renderLoading = () => (
    <div className="w-full max-w-6xl mx-auto px-4">
      <Card className="bg-background shadow-none border-none">
        <CardHeader className="px-0 flex flex-row items-center justify-between space-y-0 pb-8">
          <Skeleton className="h-8 w-1/3" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </CardHeader>
        <Skeleton className="h-12 mb-6" />
        <CardContent className="px-0">
          <div className="space-y-8">
            <div className="grid gap-6">
              {[...Array(3)].map((_, index) => (
                <Skeleton key={index} className="h-32 w-full" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderEmptySoals = () => (
    <div className="flex flex-col justify-center items-center py-16 bg-secondary/30 rounded-lg text-center min-h-[78vh]">
      <FileQuestion className="h-12 w-12 text-muted-foreground mb-4" />
      <h2 className="text-xl font-semibold text-muted-foreground mb-2">
        Belum Ada Soal
      </h2>
      <p className="text-muted-foreground">
        {isAdmin
          ? "Anda dapat membuat soal baru menggunakan tombol 'Create Soal'"
          : "Tidak ada soal yang tersedia saat ini"}
      </p>
    </div>
  );

  const renderError = () => (
    <Alert variant="destructive" className="max-w-4xl mx-auto mt-8 shadow-sm">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{state.error}</AlertDescription>
    </Alert>
  );

  if (state.loading) return renderLoading();
  if (state.error) return renderError();

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <Card className="bg-background shadow-none border-none">
        <CardHeader className="px-0 flex flex-row items-center justify-between space-y-0 pb-8">
          <CardTitle className="text-xl md:text-3xl font-bold tracking-tight uppercase">
            Soal Management
          </CardTitle>
          <div className="flex gap-4">
            {isAdmin && <CreateSoalDialog onSoalCreated={api.fetchSoals} />}
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                updateState({ refreshing: true });
                api
                  .fetchSoals()
                  .finally(() => updateState({ refreshing: false }));
              }}
              disabled={state.refreshing}
              className="md:h-10 md:w-auto md:px-4 md:gap-2 font-medium hover:bg-secondary/80"
            >
              <RefreshCw
                className={`h-4 w-4 ${state.refreshing ? "animate-spin" : ""}`}
              />
              <span className="hidden md:inline">Refresh</span>
            </Button>
          </div>
        </CardHeader>

        <div className="relative mb-6 flex items-center gap-4">
          <Input
            type="text"
            placeholder="Search Soals"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSearchClick}
            className="absolute right-[185px] top-1/2 -translate-y-1/2 bg-transparent hover:bg-gray-100 focus:outline-none"
          >
            <Search className="h-5 w-5 text-gray-600" />
          </Button>
          <MultiSelectCategories />
        </div>

        <CardContent className="px-0">
          <div className="space-y-8">
            {state.deleteError && (
              <Alert variant="destructive" className="shadow-sm">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{state.deleteError}</AlertDescription>
              </Alert>
            )}
            <div className="grid gap-6">
              {state.soals.length > 0
                ? state.soals.map((soal) => (
                    <SoalCard
                      key={soal.id}
                      soal={soal}
                      refetchData={api.fetchSoals}
                      editingId={state.editingId}
                      editUrl={state.editUrl}
                      onEdit={(soal) =>
                        updateState({
                          editingId: soal.id,
                          editUrl: soal.url || "",
                        })
                      }
                      onDelete={(id) =>
                        updateState({
                          deletingId: id,
                          deleteDialogOpen: true,
                          deleteError: null,
                        })
                      }
                      onUpdate={api.updateSoal}
                      onCancel={() =>
                        updateState({
                          editingId: null,
                          editUrl: "",
                          updateMessage: { type: "", message: "" },
                        })
                      }
                      onEditUrlChange={(url) => updateState({ editUrl: url })}
                      onToggleFavorite={api.toggleFavorite}
                      onSubmitToken={api.submitFlag}
                      solvedSoals={solvedSoals}
                    />
                  ))
                : renderEmptySoals()}
            </div>
          </div>
        </CardContent>
      </Card>
      <DeleteSoalDialog
        isOpen={state.deleteDialogOpen}
        onOpenChange={(open) => updateState({ deleteDialogOpen: open })}
        onConfirm={async () => {
          if (state.deletingId) {
            api.deleteSoal(state.deletingId);
          }
        }}
      />
    </div>
  );
};

function initializeSoals(): Soal[] {
  if (typeof window === "undefined") return [];

  const savedSoals = localStorage.getItem("soals");
  if (!savedSoals) return [];

  try {
    const parsedSoals = JSON.parse(savedSoals);
    return parsedSoals.map((soal: Soal) => ({
      ...soal,
      isFavorite: Cookies.get(`favorite_${soal.id}`) === "true",
    }));
  } catch {
    return [];
  }
}

export default SoalManager;
