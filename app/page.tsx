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
import { TooltipProvider } from "@/components/ui/tooltip";
import { ChevronDown, Medal } from "lucide-react";

interface BenchmarkResult {
  agent: string;
  run_date: string;
  needle_in_haystack: string[];
  remediated: string[];
  pr_review: string[];
  true_positive_rate: number;
  total_bugs: number;
  pr_review_true_positive_rate?: number;
}

type SortField = "needle_in_haystack" | "true_positive_rate" | "remediated";

type PRSortField = "pr_review" | "pr_review_true_positive_rate";

export default function SM100Dashboard() {
  const [results, setResults] = useState<BenchmarkResult[]>([]);
  const [sortedResults, setSortedResults] = useState<BenchmarkResult[]>([]);
  const [sortedPRResults, setSortedPRResults] = useState<BenchmarkResult[]>([]);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [expandedPRRow, setExpandedPRRow] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>("needle_in_haystack");
  const [prSortField, setPRSortField] = useState<PRSortField>("pr_review");

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
    const sorted = [...results].sort((a, b) => {
      switch (sortField) {
        case "needle_in_haystack":
          return (
            (b.needle_in_haystack || []).length -
            (a.needle_in_haystack || []).length
          );
        case "true_positive_rate":
          return b.true_positive_rate - a.true_positive_rate;
        case "remediated":
          return (b.remediated || []).length - (a.remediated || []).length;
        default:
          return 0;
      }
    });
    setSortedResults(sorted);
  }, [results, sortField]);

  useEffect(() => {
    const sorted = [...results]
      .filter((a) => a.pr_review)
      .sort((a, b) => {
        switch (prSortField) {
          case "pr_review":
            return (b.pr_review || []).length - (a.pr_review || []).length;
          case "pr_review_true_positive_rate":
            const aRate = a.pr_review_true_positive_rate ?? 0;
            const bRate = b.pr_review_true_positive_rate ?? 0;
            return bRate - aRate;
          default:
            return 0;
        }
      });
    setSortedPRResults(sorted);
  }, [results, prSortField]);

  const handleSort = (field: SortField) => {
    setSortField(field);
  };

  const handlePRSort = (field: PRSortField) => {
    setPRSortField(field);
  };

  const toggleRow = (index: number) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const togglePRRow = (index: number) => {
    setExpandedPRRow(expandedPRRow === index ? null : index);
  };

  const getMedalIcon = (index: number) => {
    if (index === 0) {
      return <Medal className="h-4 w-4 text-yellow-500" />; // Gold
    } else if (index === 1) {
      return <Medal className="h-4 w-4 text-gray-400" />; // Silver
    } else if (index === 2) {
      return <Medal className="h-4 w-4 text-amber-600" />; // Bronze
    }
    return null;
  };

  return (
    <TooltipProvider>
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Blue Banner */}
          <div className="bg-card rounded-lg p-6 mb-8">
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
            <div className="text-muted-foreground">
              <p>
                The SM-100 benchmark evaluates software engineering agents based
                on their ability to identify and remediate bugs within
                real-world codebases.
              </p>
              <p className="mt-2">
                It measures agent performance through four metrics:
              </p>
              <ul className="list-decimal list-inside">
                <li>
                  Needle in Haystack: The count of actual bugs from the SM-100
                  dataset found by agents without providing additional context
                  or hints.
                </li>
                <li>
                  True Positive Rate: The percent of valid reports out of all
                  bugs listed by the agent.
                </li>
                <li>
                  Remediated Bugs: The number of needle in haystack bugs that
                  were successfully fixed.
                </li>
                <li>
                  PR Results: The number of SM-100 dataset bugs discovered when
                  agents review the PR or commit that introduced the bug.
                </li>
              </ul>
              <p className="mt-2">
                All results are pass@1 as we believe these systems should be
                single, comprehensive tools, and users running them multiple
                times is not representative of real-world usage.
              </p>
            </div>

            <h1 className="text-2xl font-bold text-foreground mb-2 mt-4">
              Interpreting Results
            </h1>
            <div className="text-muted-foreground">
              <p>
                The best agents will have a high needle in haystack count while
                still retaining accuracy in their reports shown by a high true
                positive rate. The needle in haystack count demonstrates ability
                to navigate and reason across large code bases and identify a
                wide variety of bugs. A high true positive rate meanwhile
                indicates that the agent is able to effectively distinguish
                between meaningful bugs and irrelevant issues. Even if an
                agent finds many needle in haystack bugs, if it is surrounded by
                false positives in a flood of reports, the real world usefulness
                of the agent is diminished as alert fatigue sets in and reports
                become disregarded before real issues are found.
              </p>
            </div>
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
                      Needle in Haystack
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSort("needle_in_haystack");
                        }}
                        className={`h-6 w-6 p-0 ${
                          sortField === "needle_in_haystack"
                            ? "bg-accent/30"
                            : "text-slate-500"
                        }`}
                      >
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableHead>
                  <TableHead className="text-left text-xs font-medium uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      True Positive Rate
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSort("true_positive_rate");
                        }}
                        className={`h-6 w-6 p-0 ${
                          sortField === "true_positive_rate"
                            ? "bg-accent/30"
                            : "text-slate-500"
                        }`}
                      >
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableHead>
                  <TableHead className="text-left text-xs font-medium uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      Remediated Bugs
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSort("remediated");
                        }}
                        className={`h-6 w-6 p-0 ${
                          sortField === "remediated"
                            ? "bg-accent/30"
                            : "text-slate-500"
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
                  ? Array.from({ length: 10 }).map((_, index) => (
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
                          <Skeleton className="h-4 w-12" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-8" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-8" />
                        </TableCell>
                      </TableRow>
                    ))
                  : sortedResults.map((result, index) => (
                      <React.Fragment key={index}>
                        <TableRow
                          className={`cursor-pointer ${
                            result.agent === "Bismuth" ? "font-bold" : ""
                          }`}
                          onClick={() => toggleRow(index)}
                        >
                          <TableCell className="font-medium text-foreground">
                            <div className="flex items-center gap-2">
                              {getMedalIcon(index)}
                              <span
                                className={
                                  result.agent === "Bismuth" ? "font-bold" : ""
                                }
                              >
                                {result.agent}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-foreground">
                            {result.run_date}
                          </TableCell>
                          <TableCell className="text-foreground">
                            {result.needle_in_haystack === null
                              ? "N/A"
                              : result.needle_in_haystack.length}
                          </TableCell>
                          <TableCell className="text-foreground">
                            ~{(result.true_positive_rate * 100).toFixed(0)}% (
                            {result.total_bugs})
                          </TableCell>
                          <TableCell className="text-foreground">
                            {result.remediated === null
                              ? "N/A"
                              : result.remediated.length}
                          </TableCell>
                        </TableRow>
                        {expandedRow === index && (
                          <TableRow>
                            <TableCell colSpan={5} className="p-6">
                              <div className="grid grid-cols-2 gap-4 h-64">
                                <div className="flex flex-col">
                                  <h4 className="text-sm font-medium text-foreground mb-2">
                                    Needle in Haystack Results (
                                    {result.needle_in_haystack === null
                                      ? "N/A"
                                      : result.needle_in_haystack.length}
                                    )
                                  </h4>
                                  <div className="flex-1 overflow-y-auto border border-border rounded-md p-2 space-y-1">
                                    {(result.needle_in_haystack || []).map(
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
                                    Remediated Issues (
                                    {result.remediated === null
                                      ? "N/A"
                                      : result.remediated.length}
                                    )
                                  </h4>
                                  <div className="flex-1 overflow-y-auto border border-border rounded-md p-2 space-y-1">
                                    {(result.remediated || []).map(
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
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))}
              </TableBody>
            </Table>
          </div>

          {/* PR Review Table */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">PR Review Results</h2>
            <div className="text-muted-foreground mb-4">
              <p>
                Out of the 100 problems in the dataset, 80 were identified to
                have a single specific "introduction" commit. For these, agents
                were asked to review the PR or commit diff for issues.
              </p>
              <p>
                Given the reduced area to examine and the inclusion of nearly
                all relevant files without the agents having to traverse the
                codebase to discover them, we see significantly higher bug
                discovery rates across the board.
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
                        PR Review
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePRSort("pr_review");
                          }}
                          className={`h-6 w-6 p-0 ${
                            prSortField === "pr_review"
                              ? "bg-accent/30"
                              : "text-slate-500"
                          }`}
                        >
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableHead>
                    <TableHead className="text-left text-xs font-medium uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        True Positive Rate
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePRSort("pr_review_true_positive_rate");
                          }}
                          className={`h-6 w-6 p-0 ${
                            prSortField === "pr_review_true_positive_rate"
                              ? "bg-accent/30"
                              : "text-slate-500"
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
                    ? Array.from({ length: 10 }).map((_, index) => (
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
                            <Skeleton className="h-4 w-12" />
                          </TableCell>
                        </TableRow>
                      ))
                    : sortedPRResults.map((result, index) => (
                        <React.Fragment key={index}>
                          <TableRow
                            className={`cursor-pointer ${
                              result.agent === "Bismuth" ? "font-bold" : ""
                            }`}
                            onClick={() => togglePRRow(index)}
                          >
                            <TableCell className="font-medium text-foreground">
                              <div className="flex items-center gap-2">
                                {getMedalIcon(index)}
                                <span
                                  className={
                                    result.agent === "Bismuth"
                                      ? "font-bold"
                                      : ""
                                  }
                                >
                                  {result.agent}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-foreground">
                              {result.run_date}
                            </TableCell>
                            <TableCell className="text-foreground">
                              {result.pr_review === null
                                ? "N/A"
                                : result.pr_review.length}
                            </TableCell>
                            <TableCell className="text-foreground">
                              {result.pr_review_true_positive_rate !==
                              undefined ? (
                                `~${(
                                  result.pr_review_true_positive_rate * 100
                                ).toFixed(0)}%`
                              ) : (
                                <em className="text-muted-foreground">
                                  in progress
                                </em>
                              )}
                            </TableCell>
                          </TableRow>
                          {expandedPRRow === index && (
                            <TableRow>
                              <TableCell colSpan={4} className="p-6">
                                <div className="flex flex-col h-64">
                                  <h4 className="text-sm font-medium text-foreground mb-2">
                                    PR Review Results (
                                    {result.pr_review === null
                                      ? "N/A"
                                      : result.pr_review.length}
                                    )
                                  </h4>
                                  <div className="flex-1 overflow-y-auto border border-border rounded-md p-2 space-y-1">
                                    {(result.pr_review || []).map(
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
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="mt-4 p-3 bg-muted/30 border border-muted rounded-md">
            <p className="text-sm text-muted-foreground">
              💡 Click on any row to expand and see detailed results
            </p>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
