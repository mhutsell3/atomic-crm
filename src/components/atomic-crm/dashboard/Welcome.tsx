import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Welcome = () => (
  <Card>
    <CardHeader className="px-4">
      <CardTitle>Welcome to TheoSYN CRM</CardTitle>
    </CardHeader>
    <CardContent className="px-4">
      <p className="text-sm mb-4">
        Track clients, sessions, and communications in one place. Add your
        first contact to get started, or explore the tabs above.
      </p>
      <p className="text-sm">
        Questions or feedback about the CRM itself? Reach out to TheoSYN
        Labs.
      </p>
    </CardContent>
  </Card>
);
