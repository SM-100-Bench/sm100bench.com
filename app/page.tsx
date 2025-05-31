'use client';

import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

interface BenchmarkResult {
  agent: string;
  run_date: string;
  needle_in_haystack: string[];
  remediated: string[];
  pr_review: string[];
  true_positive_rate: number;
}

export default function SM100Dashboard() {
  const [results, setResults] = useState<BenchmarkResult[]>([]);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/results.json')
      .then(response => response.json())
      .then(data => {
        setResults(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading results:', error);
        setLoading(false);
      });
  }, []);

  const toggleRow = (index: number) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              SM-100 Benchmark Results
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Performance metrics for software engineering agents
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Agent
                  </TableHead>
                  <TableHead className="text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Run Date
                  </TableHead>
                  <TableHead className="text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Needle in Haystack
                  </TableHead>
                  <TableHead className="text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    PR Results
                  </TableHead>
                  <TableHead className="text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    True Positive Rate
                  </TableHead>
                  <TableHead className="text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Remediated Bugs
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, index) => (
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
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            SM-100 Benchmark Results
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Performance metrics for software engineering agents
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Agent
                </TableHead>
                <TableHead className="text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Run Date
                </TableHead>
                <TableHead className="text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Needle in Haystack
                </TableHead>
                <TableHead className="text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  PR Results
                </TableHead>
                <TableHead className="text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  True Positive Rate
                </TableHead>
                <TableHead className="text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Remediated Bugs
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result, index) => (
                <React.Fragment key={index}>
                  <TableRow
                    className="cursor-pointer"
                    onClick={() => toggleRow(index)}
                  >
                    <TableCell className="font-medium text-gray-900 dark:text-white">
                      {result.agent}
                    </TableCell>
                    <TableCell className="text-gray-500 dark:text-gray-300">
                      {result.run_date}
                    </TableCell>
                    <TableCell className="text-gray-500 dark:text-gray-300">
                      {result.needle_in_haystack.length}
                    </TableCell>
                    <TableCell className="text-gray-500 dark:text-gray-300">
                      {result.pr_review.length}
                    </TableCell>
                    <TableCell className="text-gray-500 dark:text-gray-300">
                      {(result.true_positive_rate * 100).toFixed(1)}%
                    </TableCell>
                    <TableCell className="text-gray-500 dark:text-gray-300">
                      {result.remediated.length}
                    </TableCell>
                  </TableRow>
                  {expandedRow === index && (
                    <TableRow className="bg-gray-50 dark:bg-gray-700">
                      <TableCell colSpan={6} className="p-6">
                        <div className="grid grid-cols-3 gap-4 h-96">
                          <div className="flex flex-col">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                              Needle in Haystack Results ({result.needle_in_haystack.length})
                            </h4>
                            <div className="flex-1 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-md p-2 space-y-1">
                              {result.needle_in_haystack.map((url, urlIndex) => (
                                <a
                                  key={urlIndex}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block text-xs text-blue-600 dark:text-blue-400 hover:underline break-all"
                                >
                                  {url.replace('https://github.com/', '')}
                                </a>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex flex-col">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                              PR Review Results ({result.pr_review.length})
                            </h4>
                            <div className="flex-1 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-md p-2 space-y-1">
                              {result.pr_review.map((url, urlIndex) => (
                                <a
                                  key={urlIndex}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block text-xs text-blue-600 dark:text-blue-400 hover:underline break-all"
                                >
                                  {url.replace('https://github.com/', '')}
                                </a>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex flex-col">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                              Remediated Issues ({result.remediated.length})
                            </h4>
                            <div className="flex-1 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-md p-2 space-y-1">
                              {result.remediated.map((url, urlIndex) => (
                                <a
                                  key={urlIndex}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block text-xs text-blue-600 dark:text-blue-400 hover:underline break-all"
                                >
                                  {url.replace('https://github.com/', '')}
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
  );
}
