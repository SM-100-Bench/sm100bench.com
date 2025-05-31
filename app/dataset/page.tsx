"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Star } from "lucide-react";

interface DatasetEntry {
  url: string;
  id: string;
  source: string;
  language: string;
  introduced_by: string | null;
  implication: string;
  taxonomy: string;
  severity: string[];
  domain_expertise: string[];
  difficulty_to_find: string[];
}

interface Filters {
  language: string;
  implication: string;
  hasIntroducedBy: boolean;
  minSeverity: number;
  minDomainExpertise: number;
  minDifficultyToFind: number;
}

const levelToNumber = (level: string): number => {
  switch (level.toLowerCase()) {
    case "low":
      return 1;
    case "medium":
      return 2;
    case "high":
      return 3;
    default:
      return 1;
  }
};

const calculateAverage = (levels: string[]): number => {
  if (levels.length === 0) return 1;
  const sum = levels.reduce((acc, level) => acc + levelToNumber(level), 0);
  return Math.round(sum / levels.length);
};

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {[1, 2, 3].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating
              ? "text-foreground fill-foreground"
              : "text-secondary"
          }`}
        />
      ))}
    </div>
  );
};

const GitHubCommitLink = ({ hash, url }: { hash: string; url: string }) => {
  if (!hash || hash === "null" || typeof hash !== "string")
    return <span className="text-muted-foreground">-</span>;

  // Handle special cases
  if (
    hash.includes("change in python stdlib") ||
    hash === "forever" ||
    hash.startsWith("v")
  ) {
    return (
      <span className="text-muted-foreground text-sm">
        {hash.substring(0, 7)}
      </span>
    );
  }

  // Extract repo info from URL to construct GitHub commit link
  const urlMatch = url.match(/github\.com\/([^\/]+\/[^\/]+)/);
  if (!urlMatch)
    return (
      <span className="text-muted-foreground text-sm">
        {hash.substring(0, 7)}
      </span>
    );

  const repoPath = urlMatch[1];
  const commitUrl = `https://github.com/${repoPath}/commit/${hash}`;

  return (
    <a
      href={commitUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary hover:underline text-sm font-mono"
    >
      {hash.substring(0, 7)}
    </a>
  );
};

const SliderInput = ({
  label,
  value,
  onChange,
  min = 1,
  max = 3,
  loading = false,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  loading?: boolean;
}) => {
  const levels = ["Low", "Medium", "High"];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-3 w-20" />
        </div>
      ) : (
        <div className="space-y-2">
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
          />
          <div className="text-xs text-muted-foreground">
            {levels[value - 1]} or higher
          </div>
        </div>
      )}
    </div>
  );
};

export default function DatasetViewer() {
  const [data, setData] = useState<DatasetEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    language: "all",
    implication: "all",
    hasIntroducedBy: false,
    minSeverity: 1,
    minDomainExpertise: 1,
    minDifficultyToFind: 1,
  });

  useEffect(() => {
    fetch("/SM-100.json")
      .then((response) => response.json())
      .then((data: DatasetEntry[]) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading dataset:", error);
        setLoading(false);
      });
  }, []);

  const { uniqueLanguages, uniqueImplications } = useMemo(() => {
    const languages = new Set(data.map((item) => item.language));
    const implications = new Set(data.map((item) => item.implication));

    return {
      uniqueLanguages: Array.from(languages).sort(),
      uniqueImplications: Array.from(implications).sort(),
    };
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Language filter
      if (filters.language !== "all" && item.language !== filters.language) {
        return false;
      }

      // Implication filter
      if (
        filters.implication !== "all" &&
        item.implication !== filters.implication
      ) {
        return false;
      }

      // Has introduced_by filter
      if (
        filters.hasIntroducedBy &&
        (!item.introduced_by || item.introduced_by === "null")
      ) {
        return false;
      }

      // Severity filter
      const avgSeverity = calculateAverage(item.severity);
      if (avgSeverity < filters.minSeverity) {
        return false;
      }

      // Domain expertise filter
      const avgDomainExpertise = calculateAverage(item.domain_expertise);
      if (avgDomainExpertise < filters.minDomainExpertise) {
        return false;
      }

      // Difficulty to find filter
      const avgDifficultyToFind = calculateAverage(item.difficulty_to_find);
      if (avgDifficultyToFind < filters.minDifficultyToFind) {
        return false;
      }

      return true;
    });
  }, [data, filters]);

  return (
    <div className="min-h-screen">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 min-h-screen bg-sidebar shadow-lg p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Filters
            </h2>

            {/* Language Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Language</label>
              {loading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select
                  value={filters.language}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, language: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Languages</SelectItem>
                    {uniqueLanguages.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <Separator className="my-4" />

            {/* Implication Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Implication</label>
              {loading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select
                  value={filters.implication}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, implication: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select implication" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Implications</SelectItem>
                    {uniqueImplications.map((impl) => (
                      <SelectItem key={impl} value={impl}>
                        {impl}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <Separator className="my-4" />

            {/* Has Introduced By Filter */}
            <div className="flex items-center space-x-2">
              {loading ? (
                <>
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-32" />
                </>
              ) : (
                <>
                  <Checkbox
                    id="hasIntroducedBy"
                    checked={filters.hasIntroducedBy}
                    onCheckedChange={(checked) =>
                      setFilters((prev) => ({
                        ...prev,
                        hasIntroducedBy: !!checked,
                      }))
                    }
                  />
                  <label
                    htmlFor="hasIntroducedBy"
                    className="text-sm font-medium"
                  >
                    Has introduction commit
                  </label>
                </>
              )}
            </div>

            <Separator className="my-4" />

            {/* Severity Slider */}
            <SliderInput
              label="Minimum Severity"
              value={filters.minSeverity}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, minSeverity: value }))
              }
              loading={loading}
            />

            <Separator className="my-4" />

            {/* Domain Expertise Slider */}
            <SliderInput
              label="Minimum Domain Expertise"
              value={filters.minDomainExpertise}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, minDomainExpertise: value }))
              }
              loading={loading}
            />

            <Separator className="my-4" />

            {/* Difficulty to Find Slider */}
            <SliderInput
              label="Minimum Difficulty to Find"
              value={filters.minDifficultyToFind}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, minDifficultyToFind: value }))
              }
              loading={loading}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0 bg-background">
          <div className="p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Explore the SM-100 dataset
              </h1>
              <p className="text-muted-foreground">
                {filteredData.length} of {data.length} entries shown
              </p>
            </div>

            <div className="shadow-lg rounded-lg overflow-hidden">
              <Table className="w-full min-w-max">
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px] max-w-[300px]">
                      ID
                    </TableHead>
                    <TableHead className="min-w-[100px]">Language</TableHead>
                    <TableHead className="min-w-[200px] max-w-[300px]">
                      Implication
                    </TableHead>
                    <TableHead className="min-w-[160px]">Avg Rating</TableHead>
                    <TableHead className="min-w-[120px]">
                      Introduced By
                    </TableHead>
                    <TableHead className="min-w-[100px]">Source</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading
                    ? Array.from({ length: 8 }).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell className="min-w-[200px] max-w-[300px]">
                            <Skeleton className="h-4 w-36" />
                          </TableCell>
                          <TableCell className="min-w-[100px]">
                            <Skeleton className="h-6 w-16 rounded" />
                          </TableCell>
                          <TableCell className="min-w-[200px] max-w-[300px]">
                            <Skeleton className="h-4 w-40" />
                          </TableCell>
                          <TableCell className="min-w-[160px]">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <Skeleton className="h-3 w-8" />
                                <div className="flex space-x-1">
                                  <Skeleton className="h-4 w-4" />
                                  <Skeleton className="h-4 w-4" />
                                  <Skeleton className="h-4 w-4" />
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Skeleton className="h-3 w-8" />
                                <div className="flex space-x-1">
                                  <Skeleton className="h-4 w-4" />
                                  <Skeleton className="h-4 w-4" />
                                  <Skeleton className="h-4 w-4" />
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Skeleton className="h-3 w-8" />
                                <div className="flex space-x-1">
                                  <Skeleton className="h-4 w-4" />
                                  <Skeleton className="h-4 w-4" />
                                  <Skeleton className="h-4 w-4" />
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="min-w-[120px]">
                            <Skeleton className="h-4 w-14" />
                          </TableCell>
                          <TableCell className="min-w-[100px]">
                            <Skeleton className="h-4 w-20" />
                          </TableCell>
                        </TableRow>
                      ))
                    : filteredData.map((item) => {
                        const avgSeverity = calculateAverage(item.severity);
                        const avgDomainExpertise = calculateAverage(
                          item.domain_expertise
                        );
                        const avgDifficultyToFind = calculateAverage(
                          item.difficulty_to_find
                        );

                        return (
                          <TableRow key={item.id}>
                            <TableCell className="min-w-[200px] max-w-[300px]">
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline font-medium block truncate"
                                title={item.id}
                              >
                                {item.id}
                              </a>
                            </TableCell>
                            <TableCell className="min-w-[100px]">
                              <span className="px-2 py-1 bg-muted rounded text-sm">
                                {item.language}
                              </span>
                            </TableCell>
                            <TableCell className="min-w-[200px] max-w-[300px] text-sm">
                              <div
                                className="truncate"
                                title={item.implication}
                              >
                                {item.implication}
                              </div>
                            </TableCell>
                            <TableCell className="min-w-[160px]">
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-muted-foreground w-12">
                                    Sev:
                                  </span>
                                  <StarRating rating={avgSeverity} />
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-muted-foreground w-12">
                                    Exp:
                                  </span>
                                  <StarRating rating={avgDomainExpertise} />
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-muted-foreground w-12">
                                    Diff:
                                  </span>
                                  <StarRating rating={avgDifficultyToFind} />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="min-w-[120px]">
                              <GitHubCommitLink
                                hash={item.introduced_by || ""}
                                url={item.url}
                              />
                            </TableCell>
                            <TableCell className="min-w-[100px] text-sm text-muted-foreground">
                              <div className="truncate" title={item.source}>
                                {item.source}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
