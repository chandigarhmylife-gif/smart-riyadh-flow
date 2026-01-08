import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function DataPreviewTable({ data = [] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const defaultData = [
    { timestamp: '2024-01-08 08:00:00', direction: 'North', count: 45, speed: 35 },
    { timestamp: '2024-01-08 08:15:00', direction: 'South', count: 38, speed: 42 },
    { timestamp: '2024-01-08 08:30:00', direction: 'East', count: 52, speed: 28 },
    { timestamp: '2024-01-08 08:45:00', direction: 'West', count: 41, speed: 38 },
    { timestamp: '2024-01-08 09:00:00', direction: 'North', count: 58, speed: 25 }
  ];

  const displayData = data.length > 0 ? data : defaultData;
  const totalPages = Math.ceil(displayData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = displayData.slice(startIndex, startIndex + rowsPerPage);

  return (
    <Card className="border-2 border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Data Preview</CardTitle>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-slate-600">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Direction</TableHead>
                <TableHead>Vehicle Count</TableHead>
                <TableHead>Avg Speed (mph)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="font-mono text-sm">{row.timestamp}</TableCell>
                  <TableCell>{row.direction}</TableCell>
                  <TableCell>{row.count}</TableCell>
                  <TableCell>{row.speed}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}