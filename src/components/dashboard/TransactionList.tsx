"use client";

import { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownLeft, RefreshCw } from "lucide-react";
import { format } from "date-fns";

interface Transaction {
  id: string;
  amount: number;
  type: string;
  gameType?: string;
  createdAt: string;
}

interface Pagination {
  total: number;
  pages: number;
  page: number;
  limit: number;
}

export function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchTransactions = async (pageNum: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/user/transactions?page=${pageNum}&limit=10`);
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(page);
  }, [page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "deposit":
      case "win":
      case "bonus":
        return "text-tropical-teal-400";
      case "bet":
      case "withdrawal":
        return "text-red-400";
      default:
        return "text-cornsilk-100";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "deposit":
      case "win":
      case "bonus":
        return <ArrowDownLeft className="w-4 h-4 text-tropical-teal-400" />;
      case "bet":
      case "withdrawal":
        return <ArrowUpRight className="w-4 h-4 text-red-400" />;
      default:
        return <RefreshCw className="w-4 h-4 text-cornsilk-400" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-ink-black-800 bg-ink-black-900/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-ink-black-800 hover:bg-ink-black-900">
              <TableHead className="text-ink-black-400">Date</TableHead>
              <TableHead className="text-ink-black-400">Type</TableHead>
              <TableHead className="text-ink-black-400">Game</TableHead>
              <TableHead className="text-right text-ink-black-400">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-cerulean-500"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-ink-black-400">
                  No transactions found.
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((tx) => (
                <TableRow key={tx.id} className="border-ink-black-800 hover:bg-ink-black-800/50">
                  <TableCell className="text-cornsilk-200">
                    {format(new Date(tx.createdAt), "MMM d, yyyy HH:mm")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(tx.type)}
                      <span className="capitalize text-cornsilk-100">{tx.type}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-ink-black-400 capitalize">
                    {tx.gameType || "-"}
                  </TableCell>
                  <TableCell className={`text-right font-mono font-medium ${getTypeColor(tx.type)}`}>
                    {tx.type === "bet" || tx.type === "withdrawal" ? "-" : "+"}
                    {formatCurrency(tx.amount)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1 || isLoading}
            className="border-ink-black-700 hover:bg-ink-black-800 text-cornsilk-200"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-ink-black-400">
            Page {page} of {pagination.pages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= pagination.pages || isLoading}
            className="border-ink-black-700 hover:bg-ink-black-800 text-cornsilk-200"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
