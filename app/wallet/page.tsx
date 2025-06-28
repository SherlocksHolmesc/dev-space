'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Wallet } from 'lucide-react';

export default function WalletPage() {
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    async function getBalance() {
      try {
        const res = await fetch('/api/balance', { method: 'GET' });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const json = await res.json();
        setBalance(json.balance);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    getBalance();

    async function getHistory() {
      try {
        const res = await fetch('/api/history');
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const json = await res.json();
        console.log('Fetched history:', json);
        if (!json.history || !Array.isArray(json.history)) {
          console.error("Invalid history data structure:", json);
          setHistory([]); // fallback gracefully
          return;
        }
        setHistory(json.history);
      } catch (err: any) {
        console.error(err.message);
        setHistory([]);
      }
    }
    getHistory();

  }, []);

  return (
    <div className="min-h-screen space-bg">
      <div className="w-full px-6 py-12 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-8">
          <div className="lg:col-span-1 space-y-6">
            <Card className="space-card">
              <CardHeader>
                <CardTitle className="text-orange-500 flex items-center gap-2">
                  <Wallet className="w-5 h-5" /> Wallet Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Balance</span>
                  <span className="text-white font-medium">
                    {loading ? '...' : error ? '--' : balance !== null && !isNaN(Number(balance)) ? Number(balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : balance}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Token</span>
                  <span className="text-white font-medium">MAS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className="text-green-400 font-medium">Active</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <Card className="space-card">
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <div className="w-10 h-10 rounded-lg gradient-orange flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-black" />
                </div>
                <CardTitle className="text-white text-2xl font-bold flex-1">Wallet Balance</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4 pt-0 pb-6">
                <Avatar className="w-16 h-16 border-2 border-orange-500 shadow-orange-500/20 shadow-lg">
                  <AvatarImage src="/placeholder-logo.svg" alt="Token" />
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-orange-500 to-yellow-500 text-black">T</AvatarFallback>
                </Avatar>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-extrabold text-orange-500">
                    {loading ? '...' : error ? '--' : balance !== null && !isNaN(Number(balance)) ? Number(balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : balance}
                  </span>
                  <Badge className="bg-gray-800/50 text-gray-300 text-lg px-3 py-1" variant="secondary">MAS</Badge>
                </div>
                <div className="text-gray-400 text-sm mt-2">
                  {loading && 'Loading your MasChain token balance...'}
                  {error && `Error: ${error}`}
                  {!loading && !error && 'This is your current MasChain token balance.'}
                </div>
              </CardContent>
            </Card>

            <Card className="space-card">
              <CardHeader>
                <CardTitle className="text-orange-500 text-lg">Wallet Activity Table</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">From</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">To</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Amount</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">date</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Explorer</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {!history || history.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center text-gray-400 py-4">No transactions found.</td>
                        </tr>
                      ) : (
                        (showAll ? history : history.slice(0, 5)).map((tx, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 text-sm text-white">{tx.from.slice(0, 6)}...{tx.from.slice(-4)}</td>
                            <td className="px-4 py-2 text-sm text-white">{tx.to.slice(0, 6)}...{tx.to.slice(-4)}</td>
                            <td className="px-4 py-2 text-sm text-white">{(Number(tx.amount) / Math.pow(10, tx.decimal)).toFixed(2)}</td>

                            <td className="px-4 py-2 text-sm">
                              <span
                                className={`inline-block px-2 py-1 rounded 
      ${tx.status === 'success' ? 'bg-green-600/20 text-green-400' :
                                    tx.status === 'pending' ? 'bg-yellow-600/20 text-yellow-400' :
                                      'bg-red-600/20 text-red-400'}`}
                              >
                                {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-sm text-white">
                              {new Date(tx.timestamp).toLocaleString(undefined, {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false
                              }).replace(',', '')}
                            </td>
                            <td className="px-4 py-2 text-sm">
                              <a
                                href={`https://explorer-testnet.maschain.com/${tx.transactionHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 underline"
                              >
                                View
                              </a>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                {history.length > 5 && (
                  <div className="flex justify-center mt-4">
                    <button
                      className="px-4 py-2 rounded bg-gray-800 text-gray-200 hover:bg-gray-700 border border-gray-700 transition"
                      onClick={() => setShowAll((prev) => !prev)}
                    >
                      {showAll ? 'Show Less' : 'Show More'}
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}