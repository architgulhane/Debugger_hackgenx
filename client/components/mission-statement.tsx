import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function MissionStatement() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Our Mission</CardTitle>
        <CardDescription>Transforming public budget allocation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          The Smart Budget Allocation System aims to revolutionize how public funds are distributed by leveraging
          artificial intelligence, data analytics, and transparent governance principles.
        </p>
        <p>
          Our platform empowers government officials, policymakers, and citizens to make informed decisions about
          resource allocation, ensuring that public funds are used efficiently and effectively to address societal
          needs.
        </p>
      </CardContent>
    </Card>
  )
}
