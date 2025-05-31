"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { ChevronDown } from "lucide-react";

interface BenchmarkResult {
  agent: string;
  run_date: string;
  needle_in_haystack: string[];
  remediated: string[];
  pr_review: string[];
  true_positive_rate: number;
}

type SortField =
  | "needle_in_haystack"
  | "pr_review"
  | "true_positive_rate"
  | "remediated";

export default function SM100Dashboard() {
  const [results, setResults] = useState<BenchmarkResult[]>([]);
  const [sortedResults, setSortedResults] = useState<BenchmarkResult[]>([]);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>("needle_in_haystack");

  useEffect(() => {
    fetch("/results.json")
      .then((response) => response.json())
      .then((data) => {
        setResults(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading results:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (sortField) {
      const sorted = [...results].sort((a, b) => {
        switch (sortField) {
          case "needle_in_haystack":
            return b.needle_in_haystack.length - a.needle_in_haystack.length;
          case "pr_review":
            return b.pr_review.length - a.pr_review.length;
          case "true_positive_rate":
            return b.true_positive_rate - a.true_positive_rate;
          case "remediated":
            return b.remediated.length - a.remediated.length;
          default:
            return 0;
        }
      });
      setSortedResults(sorted);
    } else {
      setSortedResults(results);
    }
  }, [results, sortField]);

  const handleSort = (field: SortField) => {
    setSortField(field);
  };

  const toggleRow = (index: number) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  return (
    <TooltipProvider>
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Blue Banner */}
          <div className="bg-slate-900 border-slate-700 border border-primary/20 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-2">Introducing SM-100</h2>
            <p className="mb-3">
              Just how well do software agents navigate code bases and find real
              bugs?
            </p>
            <p>
              Learn more at our{" "}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-primary"
              >
                AI Engineers World Fair
              </a>{" "}
              presentation.
            </p>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Benchmark Results
            </h1>
            <p className="text-muted-foreground">
              Evaluating software engineering agents on bug detection and
              remediation
            </p>
          </div>

          <div className="shadow-lg rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left text-xs font-medium uppercase tracking-wider">
                    Agent
                  </TableHead>
                  <TableHead className="text-left text-xs font-medium uppercase tracking-wider">
                    Run Date
                  </TableHead>
                  <TableHead className="text-left text-xs font-medium uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-help">
                            Needle in Haystack
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            The number of bugs found in the SM-100 dataset given
                            no context
                          </p>
                        </TooltipContent>
                      </Tooltip>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSort("needle_in_haystack");
                        }}
                        className={`h-6 w-6 p-0 ${
                          sortField !== "needle_in_haystack" && "text-slate-500"
                        }`}
                      >
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableHead>
                  <TableHead className="text-left text-xs font-medium uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-help">PR Results</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            The number of bugs found given the PR/commit that
                            introduced them
                          </p>
                        </TooltipContent>
                      </Tooltip>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSort("pr_review");
                        }}
                        className={`h-6 w-6 p-0 ${
                          sortField !== "pr_review" && "text-slate-500"
                        }`}
                      >
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableHead>
                  <TableHead className="text-left text-xs font-medium uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-help">
                            True Positive Rate
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Percent of all reports that are valid bugs</p>
                        </TooltipContent>
                      </Tooltip>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSort("true_positive_rate");
                        }}
                        className={`h-6 w-6 p-0 ${
                          sortField !== "true_positive_rate" && "text-slate-500"
                        }`}
                      >
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableHead>
                  <TableHead className="text-left text-xs font-medium uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-help">Remediated Bugs</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            The number of needle in haystack bugs that were
                            successfully remediated
                          </p>
                        </TooltipContent>
                      </Tooltip>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSort("remediated");
                        }}
                        className={`h-6 w-6 p-0 ${
                          sortField !== "remediated" && "text-slate-500"
                        }`}
                      >
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading
                  ? Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-20" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-8" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-8" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-12" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-8" />
                        </TableCell>
                      </TableRow>
                    ))
                  : sortedResults.map((result, index) => (
                      <React.Fragment key={index}>
                        <TableRow
                          className="cursor-pointer"
                          onClick={() => toggleRow(index)}
                        >
                          <TableCell className="font-medium text-foreground">
                            {result.agent}
                          </TableCell>
                          <TableCell className="text-foreground">
                            {result.run_date}
                          </TableCell>
                          <TableCell className="text-foreground">
                            {result.needle_in_haystack.length}
                          </TableCell>
                          <TableCell className="text-foreground">
                            {result.pr_review.length}
                          </TableCell>
                          <TableCell className="text-foreground">
                            {(result.true_positive_rate * 100).toFixed(0)}%
                          </TableCell>
                          <TableCell className="text-foreground">
                            {result.remediated.length}
                          </TableCell>
                        </TableRow>
                        {expandedRow === index && (
                          <TableRow>
                            <TableCell colSpan={6} className="p-6">
                              <div className="grid grid-cols-3 gap-4 h-96">
                                <div className="flex flex-col">
                                  <h4 className="text-sm font-medium text-foreground mb-2">
                                    Needle in Haystack Results (
                                    {result.needle_in_haystack.length})
                                  </h4>
                                  <div className="flex-1 overflow-y-auto border border-border rounded-md p-2 space-y-1">
                                    {result.needle_in_haystack.map(
                                      (url, urlIndex) => (
                                        <a
                                          key={urlIndex}
                                          href={url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="block text-xs text-primary hover:underline break-all"
                                        >
                                          {url.replace(
                                            "https://github.com/",
                                            ""
                                          )}
                                        </a>
                                      )
                                    )}
                                  </div>
                                </div>

                                <div className="flex flex-col">
                                  <h4 className="text-sm font-medium text-foreground mb-2">
                                    PR Review Results ({result.pr_review.length}
                                    )
                                  </h4>
                                  <div className="flex-1 overflow-y-auto border border-border rounded-md p-2 space-y-1">
                                    {result.pr_review.map((url, urlIndex) => (
                                      <a
                                        key={urlIndex}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block text-xs text-primary hover:underline break-all"
                                      >
                                        {url.replace("https://github.com/", "")}
                                      </a>
                                    ))}
                                  </div>
                                </div>

                                <div className="flex flex-col">
                                  <h4 className="text-sm font-medium text-foreground mb-2">
                                    Remediated Issues (
                                    {result.remediated.length})
                                  </h4>
                                  <div className="flex-1 overflow-y-auto border border-border rounded-md p-2 space-y-1">
                                    {result.remediated.map((url, urlIndex) => (
                                      <a
                                        key={urlIndex}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block text-xs text-primary hover:underline break-all"
                                      >
                                        {url.replace("https://github.com/", "")}
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
