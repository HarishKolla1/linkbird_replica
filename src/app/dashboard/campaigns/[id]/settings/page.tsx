"use client";


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CampaignSettingsPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/authenticate'); // Redirect to login if no session
    }
  }, [isPending, session, router]);

  if (isPending || !session) return null; 
  return (
    <div className="flex justify-center  bg-gray-50 min-h-screen">
      <div className="w-full space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Campaign Settings</h1>
          <Button>Save All Changes</Button>
        </div>

        {/* Campaign Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="campaign-name">Campaign Name</Label>
              <Input id="campaign-name" placeholder="" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="campaign-status">Campaign Status</Label>
              <Switch id="campaign-status" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="personalization-request">Request without personalization</Label>
              <Switch id="personalization-request" />
            </div>
          </CardContent>

        
          <CardHeader>
            <CardTitle>AutoPilot Mode</CardTitle>
            <CardDescription>Let the system automatically manage LinkedIn account assignments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="mt-4">
              <Label>1 account selected</Label>
              <div className="border rounded-md p-2 mt-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    <img src="/path-to-your-user-image.png" alt="Jivesh Lakhani" className="w-full h-full object-cover" />
                  </div>
                  <span>Kolla Harish</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-600">Danger Zone</CardTitle>
            <CardDescription>Irreversible and destructive actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-3 w-full">
              <Label className="text-gray-600">Delete Campaign</Label>
              <div className="border border-gray-300 rounded-md p-4 bg-gray-50 w-full flex justify-between items-center">
                <p className="text-sm text-gray-700">
                  Permanently delete this campaign and all associated data
                </p>
                <Button variant="destructive">Delete Campaign</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
