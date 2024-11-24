"use client";

import React, { useState, useEffect } from "react";
import {
  Shield,
  Trophy,
  User,
  ArrowRight,
  Menu,
  X,
  ChevronUp,
  BookOpen,
  Globe,
  KeyRound,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const CTFLandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrollVisible, setIsScrollVisible] = useState(false);
  const router = useRouter();

  const challenges = [
    {
      icon: <Globe className="w-12 h-12 text-blue-500" />,
      title: "Web Exploitation",
      description: "Temukan kelemahan di aplikasi web dan jaringan",
    },
    {
      icon: <KeyRound className="w-12 h-12 text-green-500" />,
      title: "Cryptography",
      description: "Pecahkan kode rahasia dan enkripsi kompleks",
    },
    {
      icon: <BookOpen className="w-12 h-12 text-purple-500" />,
      title: "Reverse Engineering",
      description: "Analisis dan dekonstruksi perangkat lunak",
    },
  ];

  const scrollToTop = () => {
    const duration = 1500;
    const start = window.pageYOffset;
    const startTime = performance.now();

    const easeInOutQuad = (t: number) => {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    };

    const animation = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeInOutQuad(progress);

      window.scrollTo(0, start * (1 - easedProgress));

      if (progress < 1) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };

  useEffect(() => {
    const toggleVisibility = () => {
      setIsScrollVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const onClickAuthLogin = () => {
    router.push("/login");
  };

  const onClickAuthRegister = () => {
    router.push("/register");
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-black min-h-screen text-white overflow-x-hidden">
      {isScrollVisible && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to Top"
          className="fixed bottom-6 right-6 z-50 bg-blue-600/80 text-white p-3 rounded-full shadow-2xl hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-110 backdrop-blur-sm"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}

      <nav className="fixed w-full z-40 bg-black/50 backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-white flex items-center">
                <Shield className="mr-2 text-blue-400 animate-pulse" />
                CYBER CTF
              </span>
            </div>

            <div className="hidden md:flex space-x-6 items-center">
              <Link
                href="#home"
                className="text-gray-300 hover:text-white transition-colors group"
                onClick={scrollToTop}
              >
                Beranda
                <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-white"></span>
              </Link>
              <div className="space-x-3">
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
                  onClick={onClickAuthLogin}
                >
                  Masuk
                </button>
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700"
                  onClick={onClickAuthRegister}
                >
                  Daftar
                </button>
              </div>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-blue-400 transition-colors"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6 animate-rotate-in" />
                ) : (
                  <Menu className="h-6 w-6 animate-rotate-out" />
                )}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-black/70 backdrop-blur-md animate-slide-in">
            <div className="px-4 pt-2 pb-4 space-y-2">
              <Link
                href="#home"
                onClick={scrollToTop}
                className="block py-2 text-gray-300 hover:bg-blue-900/50 rounded-md transition-colors"
              >
                Beranda
              </Link>
              <div className="space-y-2 pt-2">
                <button
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                  onClick={onClickAuthLogin}
                >
                  Masuk
                </button>
                <button
                  className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors"
                  onClick={onClickAuthRegister}
                >
                  Daftar
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      <header className="pt-24 pb-16 px-4 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-purple-900/30 opacity-50 blur-3xl"></div>
        <div className="max-w-4xl mx-auto md:mt-32 mt-12 relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight animate-fade-in">
            Uji Kemampuan Keamanan Siber Anda
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto animate-fade-in-delay">
            Platform Capture The Flag (CTF) terdepan untuk mengasah skill
            keamanan siber dan pemrograman.
          </p>
          <div className="space-x-4">
            <button
              className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors flex items-center justify-center mx-auto group"
              onClick={onClickAuthLogin}
            >
              Mulai Tantangan
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </header>

      <section className="py-16 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20 opacity-50 blur-3xl"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Kategori Tantangan
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {challenges.map((challenge, index) => (
              <div
                key={index}
                className="bg-gray-800/50 p-6 rounded-xl text-center hover:bg-gray-800/70 transition-all duration-300 border border-gray-700 group"
              >
                <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform">
                  {challenge.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  {challenge.title}
                </h3>
                <p className="text-gray-400 text-sm">{challenge.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-900/50 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-white">
            Statistik Platform
          </h2>
          <div className="grid grid-flow-col md:grid-cols-2 gap-8 justify-evenly items-center">
            <div className="bg-blue-900/30 p-6 rounded-xl hover:bg-blue-900/50 transition-colors">
              <Trophy className="mx-auto mb-4 text-yellow-400" size={48} />
              <h3 className="text-2xl font-bold text-white">250+</h3>
              <p className="text-gray-300">Tantangan</p>
            </div>
            <div className="bg-blue-900/30 p-6 rounded-xl hover:bg-blue-900/50 transition-colors">
              <User className="mx-auto mb-4 text-green-400" size={48} />
              <h3 className="text-2xl font-bold text-white">5,000+</h3>
              <p className="text-gray-300">Peserta</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-blue-900/50 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 animate-pulse">
            Siap Menghadapi Tantangan?
          </h2>
          <p className="text-xl mb-8 text-gray-300">
            Daftarkan diri Anda dan buktikan keahlian keamanan siber Anda!
          </p>
          <div className="space-x-4">
            <button
              className="bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition-colors group"
              onClick={onClickAuthRegister}
            >
              Daftar Sekarang
              <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-white mt-1"></span>
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-black/50 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Shield className="mr-2 text-blue-400" /> CYBER CTF
            </h3>
            <p className="text-gray-400">
              Platform kompetisi keamanan siber untuk membangun talenta keamanan
              informasi.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Tautan Cepat</h4>
            <nav className="space-y-2">
              <Link
                href="#home"
                className="block text-gray-400 hover:text-white transition-colors"
                onClick={scrollToTop}
              >
                Beranda
              </Link>
            </nav>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Hubungi Kami</h4>
            <p className="text-gray-400">
              Email: support@cyberctf.com
              <br />
              Discord: CYBER CTF Community
            </p>
          </div>
        </div>
        <div className="text-center mt-8 pt-4 border-t border-gray-800">
          <p className="text-gray-500">
            © 2024 CYBER CTF. Hak Cipta Dilindungi.
          </p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes rotate-in {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(180deg);
          }
        }
        @keyframes rotate-out {
          from {
            transform: rotate(180deg);
          }
          to {
            transform: rotate(0deg);
          }
        }
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-rotate-in {
          animation: rotate-in 0.3s ease-in-out;
        }
        .animate-rotate-out {
          animation: rotate-out 0.3s ease-in-out;
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        .animate-fade-in {
          animation: fade-in 0.7s ease-out;
        }
        .animate-fade-in-delay {
          animation: fade-in 0.7s ease-out 0.3s backwards;
        }
      `}</style>
    </div>
  );
};

export default CTFLandingPage;
