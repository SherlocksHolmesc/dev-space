'use client';
import React, { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Trophy } from 'lucide-react';

// Types
interface LeaderboardUser {
  place: number;
  username: string;
  points: number;
  prize: number;
}

const leaderboardData: Record<string, LeaderboardUser[]> = {
  blog: [
    { place: 1, username: 'Klaxxon', points: 1500, prize: 5000 },
    { place: 2, username: 'Skulldugger', points: 500, prize: 2500 },
    { place: 3, username: 'Ultralex', points: 250, prize: 1250 },
    { place: 4, username: 'Protesian', points: 156, prize: 375 },
    { place: 5, username: 'Protesian', points: 156, prize: 375 },
    { place: 6, username: 'Protesian', points: 156, prize: 375 },
    { place: 7, username: 'Protesian', points: 120, prize: 250 },
    { place: 8, username: 'Protesian', points: 100, prize: 200 },
    { place: 9, username: 'Protesian', points: 90, prize: 150 },
    { place: 10, username: 'Protesian', points: 80, prize: 100 },
  ],
  comment: [
    { place: 1, username: 'CommentKing', points: 1200, prize: 4500 },
    { place: 2, username: 'ReplyQueen', points: 800, prize: 2000 },
    { place: 3, username: 'Threader', points: 600, prize: 1000 },
    { place: 4, username: 'UserA', points: 500, prize: 500 },
    { place: 5, username: 'UserB', points: 400, prize: 400 },
    { place: 6, username: 'UserC', points: 350, prize: 350 },
    { place: 7, username: 'UserD', points: 300, prize: 300 },
    { place: 8, username: 'UserE', points: 250, prize: 250 },
    { place: 9, username: 'UserF', points: 200, prize: 200 },
    { place: 10, username: 'UserG', points: 150, prize: 150 },
  ],
  bounties: [
    { place: 1, username: 'HunterX', points: 1000, prize: 4000 },
    { place: 2, username: 'BountyQueen', points: 700, prize: 1750 },
    { place: 3, username: 'Tasker', points: 500, prize: 750 },
    { place: 4, username: 'UserH', points: 400, prize: 450 },
    { place: 5, username: 'UserI', points: 350, prize: 400 },
    { place: 6, username: 'UserJ', points: 300, prize: 350 },
    { place: 7, username: 'UserK', points: 250, prize: 300 },
    { place: 8, username: 'UserL', points: 200, prize: 250 },
    { place: 9, username: 'UserM', points: 150, prize: 200 },
    { place: 10, username: 'UserN', points: 100, prize: 150 },
  ],
};

// Mock current user position
const currentUser = {
  place: 6,
  username: 'Protesian',
  points: 156,
  prize: 750,
  category: 'blog',
};

const categoryLabels: Record<string, string> = {
  blog: 'Most Active Blog Post',
  comment: 'Most Active Comment',
  bounties: 'Most Submitted Bounties',
};

export default function LeaderboardPage() {
  const [category, setCategory] = useState<string>('blog');
  const data = leaderboardData[category];

  return (
    <div className="min-h-screen space-bg flex flex-col pb-32">
      <div className="max-w-3xl mx-auto w-full pt-12">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-orange-500">Leaderboard</h1>
        <Tabs value={category} onValueChange={setCategory} className="w-full">
          <TabsList className="flex justify-center mb-8 gap-4 bg-transparent p-0">
            <TabsTrigger value="blog" className="px-6 py-3 text-base font-bold transition-all data-[state=active]:text-orange-400 data-[state=active]:shadow-[0_0_16px_4px_#ff6b35] data-[state=active]:bg-black/30 data-[state=active]:scale-105 data-[state=active]:z-10 data-[state=active]:border-b-4 data-[state=active]:border-orange-400">Blog Post</TabsTrigger>
            <TabsTrigger value="comment" className="px-6 py-3 text-base font-bold transition-all data-[state=active]:text-orange-400 data-[state=active]:shadow-[0_0_16px_4px_#ff6b35] data-[state=active]:bg-black/30 data-[state=active]:scale-105 data-[state=active]:z-10 data-[state=active]:border-b-4 data-[state=active]:border-orange-400">Comment</TabsTrigger>
            <TabsTrigger value="bounties" className="px-6 py-3 text-base font-bold transition-all data-[state=active]:text-orange-400 data-[state=active]:shadow-[0_0_16px_4px_#ff6b35] data-[state=active]:bg-black/30 data-[state=active]:scale-105 data-[state=active]:z-10 data-[state=active]:border-b-4 data-[state=active]:border-orange-400">Submitted Bounties</TabsTrigger>
          </TabsList>
          {Object.keys(leaderboardData).map((cat) => (
            <TabsContent value={cat} key={cat}>
              {/* Top 3 Cards */}
              <div className="flex justify-center gap-8 mb-10 items-end">
                {/* Podium order: 2nd, 1st, 3rd */}
                {[data[1], data[0], data[2]].map((user: LeaderboardUser, idx: number) => {
                  // idx: 0=2nd, 1=1st, 2=3rd
                  const placeIdx = idx === 0 ? 1 : idx === 1 ? 0 : 2;
                  return (
                    <div key={user.place} className={`relative flex flex-col items-center ${placeIdx === 0 ? 'z-10 scale-110 mb-0' : 'z-0 mb-6'} transition-transform`}>
                      <Card className={`space-card border-0 shadow-xl rounded-2xl p-7 flex flex-col items-center w-56 ${placeIdx === 0 ? 'glow-orange-strong' : 'glow-orange'}`}>
                        <div className={`w-20 h-20 rounded-full gradient-orange flex items-center justify-center mb-4 border-4 ${placeIdx === 0 ? 'border-yellow-400' : placeIdx === 1 ? 'border-gray-400' : 'border-orange-400'} shadow-lg animate-spin-slow`}>
                          <span className="text-3xl font-extrabold text-white drop-shadow-lg">{user.username[0]}</span>
                        </div>
                        <div className="text-lg font-bold text-white mb-1 tracking-wide">{user.username}</div>
                        <div className="text-sm text-gray-400 mb-2">Earn {user.points} points</div>
                        <div className="text-orange-400 font-bold text-xl mb-1 flex items-center gap-2">
                          <span>{user.prize.toLocaleString()}</span>
                          <span className="bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-1 rounded-full">MAS</span>
                        </div>
                        <Badge className={`mt-2 ${placeIdx === 0 ? 'bg-yellow-500' : placeIdx === 1 ? 'bg-gray-500' : 'bg-orange-600'} text-white shadow`}>Top {user.place}</Badge>
                      </Card>
                      {placeIdx === 0 && <div className="absolute -top-6 left-1/2 -translate-x-1/2"><Trophy className="w-8 h-8 text-yellow-400 drop-shadow animate-bounce" /></div>}
                    </div>
                  );
                })}
              </div>
              {/* Top 10 Table */}
              <div className="space-card rounded-xl p-4 shadow-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-orange-400">Place</TableHead>
                      <TableHead className="text-orange-400">Username</TableHead>
                      <TableHead className="text-orange-400">Points</TableHead>
                      <TableHead className="text-orange-400">Prize</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((user: LeaderboardUser) => (
                      <TableRow key={user.place} className={user.username === currentUser.username && user.place === currentUser.place && category === currentUser.category ? 'bg-orange-900/30' : ''}>
                        <TableCell className="text-white font-bold">{user.place}</TableCell>
                        <TableCell className="text-white">{user.username}</TableCell>
                        <TableCell className="text-white">{user.points}</TableCell>
                        <TableCell className="text-orange-400 font-semibold">
                          {user.prize} <span className="bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-1 rounded-full ml-2">MAS</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
} 