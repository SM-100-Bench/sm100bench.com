"use client";

import React from "react";

export default function AboutPage() {
  return (
    <div className="bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-foreground mb-6">
            About SM-100
          </h1>

          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg text-muted-foreground mb-6">
              The SM-100 benchmark is a comprehensive evaluation framework
              designed to assess how well software agents can navigate complex
              codebases and identify real bugs. This benchmark provides a
              standardized way to measure the effectiveness of AI-powered
              software engineering tools in real-world code bases.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mb-4">
              What is SM-100?
            </h2>
            <p className="text-muted-foreground mb-6">
              SM-100 evaluates software agents across multiple dimensions
              including bug detection without context (needle in haystack), bug
              identification given specific PR/commit context, and the ability
              to remediate discovered issues.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Learn More
            </h2>
            <p className="text-muted-foreground mb-6">
              For an overview of the SM-100 benchmark, watch our presentation at
              the{" "}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                AI Engineers World Fair
              </a>
              .
            </p>

            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Get Involved
            </h2>
            <p className="text-muted-foreground mb-4">
              Have questions about the benchmark or want to contribute
              improvements? Visit our{" "}
              <a
                href="https://github.com/SM-100-Bench/sm-100"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                GitHub repository
              </a>{" "}
              to ask questions, report issues, or submit enhancements to help
              make SM-100 even better.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
