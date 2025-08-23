'use client';

import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';

export default function Home() {
  const { items, total, getItemCount } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            E-Commerce App
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Built with Next.js, TypeScript, TailwindCSS, Better Auth, Neon PostgreSQL, Drizzle ORM, and Zustand
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Next.js 15
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                React framework with App Router
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                TypeScript
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Type-safe development
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Better Auth
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Modern authentication
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Drizzle ORM
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Type-safe database queries
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Setup Status
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="text-green-800 dark:text-green-200">✅ Next.js with TypeScript</span>
              <span className="text-green-600 dark:text-green-400">Ready</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="text-green-800 dark:text-green-200">✅ TailwindCSS</span>
              <span className="text-green-600 dark:text-green-400">Ready</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="text-green-800 dark:text-green-200">✅ ESLint</span>
              <span className="text-green-600 dark:text-green-400">Ready</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="text-green-800 dark:text-green-200">✅ Zustand State Management</span>
              <span className="text-green-600 dark:text-green-400">Ready</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <span className="text-yellow-800 dark:text-yellow-200">⚠️ Better Auth</span>
              <span className="text-yellow-600 dark:text-yellow-400">Needs .env setup</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <span className="text-yellow-800 dark:text-yellow-200">⚠️ Neon PostgreSQL + Drizzle</span>
              <span className="text-yellow-600 dark:text-yellow-400">Needs database setup</span>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
              Next Steps:
            </h3>
            <ol className="list-decimal list-inside text-blue-700 dark:text-blue-300 space-y-1">
              <li>Set up your Neon PostgreSQL database</li>
              <li>Copy .env.example to .env and fill in your credentials</li>
              <li>Run <code className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">npm run db:push</code> to create tables</li>
              <li>Start building your e-commerce features!</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
