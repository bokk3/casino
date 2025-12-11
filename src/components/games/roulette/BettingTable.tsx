"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface BettingTableProps {
    onPlaceBet: (type: string) => void;
    bets: Record<string, number>;
    className?: string;
    disabled?: boolean;
}

export function BettingTable({ onPlaceBet, bets, className, disabled }: BettingTableProps) {
    
    // Grid generation helpers
    const renderNumberBtn = (num: number, color: string) => (
         <button
            key={num}
            disabled={disabled}
            onClick={() => onPlaceBet(num.toString())}
            className={cn(
                "relative flex items-center justify-center h-12 border border-white/20 text-white font-bold hover:brightness-125 transition-all text-lg",
                color === "red" ? "bg-red-600" : "bg-zinc-900",
                bets[num.toString()] ? "ring-2 ring-yellow-400 z-10" : ""
            )}
         >
             {num}
             {bets[num.toString()] && (
                 <div className="absolute -top-2 -right-2 bg-yellow-400 text-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-md">
                     {bets[num.toString()]}
                 </div>
             )}
         </button>
    );

    const renderOutsideBtn = (label: string, id: string, colorClass: string = "bg-green-800") => (
        <button
           disabled={disabled}
           onClick={() => onPlaceBet(id)}
           className={cn(
               "relative flex items-center justify-center h-12 border border-white/20 text-white font-bold uppercase tracking-wider text-sm hover:brightness-110 transition-all",
               colorClass,
               bets[id] ? "ring-2 ring-yellow-400 z-10" : ""
           )}
        >
            {label}
            {bets[id] && (
                 <div className="absolute -top-2 -right-2 bg-yellow-400 text-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-md">
                     {bets[id]}
                 </div>
             )}
        </button>
    );

    return (
        <div className={cn("overflow-x-auto", className)}>
            <div className="min-w-[600px] inline-flex flex-col bg-green-900 p-8 rounded-xl border-8 border-[#3f2010] shadow-2xl">
                
                {/* Main Grid: 0 + 3 Rows x 12 Cols */}
                <div className="grid grid-cols-[50px_repeat(12,1fr)_50px] gap-1">
                    
                    {/* Zero (Spans 3 rows) */}
                    <button
                        disabled={disabled}
                        onClick={() => onPlaceBet("0")}
                        className={cn(
                            "row-span-3 flex items-center justify-center bg-green-600 text-white font-bold text-xl border border-white/20 rounded-l-md hover:brightness-110",
                            bets["0"] ? "ring-2 ring-yellow-400 z-10" : ""
                        )}
                    >
                         0
                         {bets["0"] && (
                             <div className="absolute top-2 left-2 bg-yellow-400 text-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                                 {bets["0"]}
                             </div>
                         )}
                    </button>

                    {/* Numbers 1-36 */}
                    {/* Row 3: 3, 6, 9... 36 */}
                    {[3,6,9,12,15,18,21,24,27,30,33,36].map(n => renderNumberBtn(n, "red"))}
                    <div className="flex items-center justify-center text-white/50 text-xs rotate-90">2:1</div>

                    {/* Row 2: 2, 5, 8... 35 */}
                    {[2,5,8,11,14,17,20,23,26,29,32,35].map(n => renderNumberBtn(n, "black"))}
                    <div className="flex items-center justify-center text-white/50 text-xs rotate-90">2:1</div>

                    {/* Row 1: 1, 4, 7... 34 */}
                    {[1,4,7,10,13,16,19,22,25,28,31,34].map(n => renderNumberBtn(n, "red"))}
                    <div className="flex items-center justify-center text-white/50 text-xs rotate-90">2:1</div>

                    {/* Dozens & Outside */}
                    <div className="col-start-2 col-span-4 mt-2">
                        {renderOutsideBtn("1st 12", "dozen-1")}
                    </div>
                    <div className="col-span-4 mt-2">
                        {renderOutsideBtn("2nd 12", "dozen-2")}
                    </div>
                    <div className="col-span-4 mt-2">
                        {renderOutsideBtn("3rd 12", "dozen-3")}
                    </div>
                    <div className="col-start-14 row-span-1" />

                    <div className="col-start-2 col-span-2 mt-2">
                         {renderOutsideBtn("1-18", "low")}
                    </div>
                    <div className="col-span-2 mt-2">
                         {renderOutsideBtn("EVEN", "even")}
                    </div>
                    <div className="col-span-2 mt-2">
                         {renderOutsideBtn("RED", "red", "bg-red-700")}
                    </div>
                    <div className="col-span-2 mt-2">
                         {renderOutsideBtn("BLACK", "black", "bg-black")}
                    </div>
                    <div className="col-span-2 mt-2">
                         {renderOutsideBtn("ODD", "odd")}
                    </div>
                    <div className="col-span-2 mt-2">
                         {renderOutsideBtn("19-36", "high")}
                    </div>
                </div>
            </div>
        </div>
    );
}
