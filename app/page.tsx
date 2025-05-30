'use client';

import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading SM-100 Benchmark Results...</div>
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
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {result.needle_in_haystack.length}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-500 dark:text-gray-300">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        {result.pr_review.length}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-500 dark:text-gray-300">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                        {(result.true_positive_rate * 100).toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-500 dark:text-gray-300">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                        {result.remediated.length}
                      </span>
                    </TableCell>
                  </TableRow>
                  {expandedRow === index && (
                    <TableRow className="bg-gray-50 dark:bg-gray-700">
                      <TableCell colSpan={6} className="p-6">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                              Needle in Haystack Results ({result.needle_in_haystack.length})
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                              {result.needle_in_haystack.map((url, urlIndex) => (
                                <a
                                  key={urlIndex}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline break-all"
                                >
                                  {url.replace('https://github.com/', '')}
                                </a>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                              PR Review Results ({result.pr_review.length})
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                              {result.pr_review.map((url, urlIndex) => (
                                <a
                                  key={urlIndex}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline break-all"
                                >
                                  {url.replace('https://github.com/', '')}
                                </a>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                              Remediated Issues ({result.remediated.length})
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                              {result.remediated.map((url, urlIndex) => (
                                <a
                                  key={urlIndex}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline break-all"
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
