"use client";

import { TransactionList } from "@/components/dashboard/TransactionList";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="text-ink-black-400 hover:text-cornsilk-100 hover:bg-ink-black-800">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-cornsilk-50">Transaction History</h1>
          <p className="text-ink-black-400">View your deposits, withdrawals, and game history.</p>
        </div>
      </div>

      <TransactionList />
    </div>
  );
}
