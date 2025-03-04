import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const transactions = [
  {
    id: 1,
    type: "Transfer",
    amount: "1.5 ETH",
    status: "completed",
    riskLevel: "low",
    date: "2024-03-20",
  },
  {
    id: 2,
    type: "Receive",
    amount: "0.5 ETH",
    status: "completed",
    riskLevel: "medium",
    date: "2024-03-19",
  },
  {
    id: 3,
    type: "Transfer",
    amount: "2.0 ETH",
    status: "pending",
    riskLevel: "high",
    date: "2024-03-18",
  },
];

export function TransactionTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Risk Level</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((tx) => (
          <TableRow key={tx.id}>
            <TableCell>{tx.type}</TableCell>
            <TableCell>{tx.amount}</TableCell>
            <TableCell>
              <Badge variant={tx.status === "completed" ? "default" : "secondary"}>
                {tx.status}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  tx.riskLevel === "high"
                    ? "destructive"
                    : tx.riskLevel === "medium"
                    ? "warning"
                    : "success"
                }
              >
                {tx.riskLevel}
              </Badge>
            </TableCell>
            <TableCell>{tx.date}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
