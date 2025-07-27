import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function LoyaltyPage() {
  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Loyalty & Referrals</CardTitle>
          <CardDescription>Earn points for completing jobs and referring new users.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">Loyalty points and referral information will be displayed here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
