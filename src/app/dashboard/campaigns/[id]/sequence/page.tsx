"use client";

import React, { useState, ChangeEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const App = () => {

  const { data: session, isPending } = authClient.useSession();
    const router = useRouter();
  
    useEffect(() => {
      if (!isPending && !session) {
        router.push('/authenticate'); // Redirect to login if no session
      }
    }, [isPending, session, router]);
  
    if (isPending || !session) return null; //
  const [message, setMessage] = useState<string>("");
  const [connectionMessage, setConnectionMessage] = useState<string>("");
  const [followUp1, setFollowUp1] = useState<string>("");
  const [followUp2, setFollowUp2] = useState<string>("");
  const [templateMessage, setTemplateMessage] = useState<string>("");

  const [autopilot, setAutopilot] = useState<boolean>(false);
  const [isMessagePreviewOpen, setIsMessagePreviewOpen] = useState<boolean>(false);
  const [previewContent, setPreviewContent] = useState<string>("");

  const availableFields: { key: string; desc: string }[] = [
    { key: "{{FirstName}}", desc: "First Name" },
    { key: "{{LastName}}", desc: "Last Name" },
    { key: "{{FullName}}", desc: "Full Name" },
    { key: "{{JobTitle}}", desc: "Job Title" },
    { key: "{{CompanyName}}", desc: "Company Name" },
  ];

  const showMessagePreview = (content: string) => {
    setPreviewContent(content);
    setIsMessagePreviewOpen(true);
  };

  const handleSave = (content: string) => {
    console.log("Saved content:", content);
  };

  // --- Message Editor Component ---
  const MessageEditor = ({
    title,
    subtitle,
    content,
    setContent,
    showFields = false, // new prop to control available fields
  }: {
    title: string;
    subtitle: string;
    content: string;
    setContent: (value: string) => void;
    showFields?: boolean;
  }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-gray-800 text-lg font-semibold">{title}</h3>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => showMessagePreview(content)}>
            Preview
          </Button>
          <Button variant="default" size="sm" onClick={() => handleSave(content)}>
            Save
          </Button>
        </div>
      </div>
      <p className="text-gray-500 text-sm -mt-1">{subtitle}</p>

      {/* Available Fields (only for first box) */}
      {showFields && (
        <div className="text-xs text-gray-500 mt-1">
          Available Fields:
          <div className="mt-1 space-y-1">
            {availableFields.map((f) => (
              <div key={f.key}>
                <span className="font-mono text-blue-600">{f.key}</span> - {f.desc}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message Template Section */}
      <div className="mt-3 p-3 bg-gray-100 rounded">
        <p className="text-gray-600 text-sm font-medium">Message Template</p>
        <p className="text-gray-700 text-xs mt-1">Design your message template using the available fields</p>
        <div className="mt-2 p-2 bg-gray-200 rounded text-gray-600 text-xs">
          Use {'{{field_name}}'} to insert mapped fields from your data
        </div>
        <Textarea
          value={templateMessage}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setTemplateMessage(e.target.value)}
          placeholder="Type your template here..."
          className="mt-2"
        />
      </div>
    </div>
  );

  // --- Follow-up Editor Component ---
  const FollowUpEditor = ({
    title,
    content,
    setContent,
  }: {
    title: string;
    content: string;
    setContent: (value: string) => void;
  }) => (
    <AccordionItem value={title}>
      <AccordionTrigger>{title}</AccordionTrigger>
      <AccordionContent>
        <div className="space-y-2">
          <Textarea
            value={content}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
            placeholder="Your follow-up message..."
          />
          <div className="p-2 bg-gray-200 rounded text-gray-600 text-xs">
            Use {'{{field_name}}'} to insert mapped fields from your data
          </div>
          <div className="flex space-x-2 mt-2">
            <Button variant="outline" size="sm" onClick={() => showMessagePreview(content)}>
              Preview
            </Button>
            <Button variant="default" size="sm" onClick={() => handleSave(content)}>
              Save
            </Button>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Main Message Sequence Card */}
        <Card className="shadow-lg rounded-lg w-full">
          <CardHeader className="pb-1">
            <CardTitle className="text-xl font-bold text-gray-700">Message Sequence</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Card className="shadow-md rounded-md w-full">
              <CardContent>
                <MessageEditor
                  title="Request Message"
                  subtitle="Edit your Request Message here"
                  content={message}
                  setContent={setMessage}
                  showFields={true} // only this first box shows fields
                />
              </CardContent>
            </Card>
            <Card className="shadow-md rounded-md w-full">
              <CardContent>
                <MessageEditor
                  title="Connection Message"
                  subtitle="Edit your Connection Message here"
                  content={connectionMessage}
                  setContent={setConnectionMessage}
                  showFields={false} // rest no fields
                />
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Follow-up Messages */}
        <Card className="shadow-lg rounded-lg w-full">
          <CardHeader className="pb-1">
            <CardTitle className="text-xl font-bold text-gray-700">Follow-up Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple">
              <FollowUpEditor
                title="Edit your First Follow-up Message here"
                content={followUp1}
                setContent={setFollowUp1}
              />
              <FollowUpEditor
                title="Edit your Second Follow-up Message here"
                content={followUp2}
                setContent={setFollowUp2}
              />
            </Accordion>
          </CardContent>
        </Card>

        {/* LinkedIn Account */}
        <Card className="shadow-lg rounded-lg w-full">
          <CardHeader className="pb-1">
            <CardTitle className="text-xl font-bold text-gray-700">LinkedIn Account</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <Switch id="autopilot-mode" checked={autopilot} onCheckedChange={setAutopilot} />
              <label htmlFor="autopilot-mode">Autopilot mode</label>
            </div>
            <p className="text-gray-500 text-sm sm:text-base">
              Let the system automatically manage LinkedIn account assignments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Message Preview Modal */}
      {isMessagePreviewOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 shadow-xl w-full max-w-sm">
            <h3 className="text-lg font-bold mb-4">Message Preview</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{previewContent}</p>
            <div className="mt-6 text-right">
              <Button onClick={() => setIsMessagePreviewOpen(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
