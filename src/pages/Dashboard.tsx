import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { addCredits, generateToken, getCurrentUser, logout } from "@/lib/localAuth";

function useSEO(title: string, description: string) {
  useEffect(() => {
    document.title = title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", description);
    else {
      const m = document.createElement("meta");
      m.name = "description";
      m.content = description;
      document.head.appendChild(m);
    }
  }, [title, description]);
}

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useMemo(() => getCurrentUser(), []);
  const [credits, setCredits] = useState<number>(user?.credits ?? 0);
  const [amount, setAmount] = useState<string>("");
  const [token, setToken] = useState<string | undefined>(user?.token);

  useSEO("Dashboard | Gmail Extension Web", "Manage credits and generate API tokens for the Gmail extension.");

  useEffect(() => {
    if (!user) navigate("/auth", { replace: true });
  }, [user, navigate]);

  const quickSet = (val: number) => setAmount(String(val));

  const onAddCredits = () => {
    const value = parseInt(amount, 10);
    if (!Number.isFinite(value) || value <= 0) {
      toast({ title: "Invalid amount", description: "Enter a positive number", variant: "destructive" as any });
      return;
    }
    const { ok, error, credits } = addCredits(value);
    if (!ok) return toast({ title: "Failed", description: error, variant: "destructive" as any });
    setCredits(credits || 0);
    setAmount("");
    toast({ title: "Credits added", description: `Your new balance is ${credits}` });
  };

  const onGenerate = async () => {
    const { ok, token, error } = generateToken();
    if (!ok) return toast({ title: "Failed", description: error, variant: "destructive" as any });
    setToken(token);
    toast({ title: "Token generated", description: "Copy and paste into your extension" });
  };

  const onCopy = async () => {
    if (!token) return;
    await navigator.clipboard.writeText(token);
    toast({ title: "Copied", description: "Token copied to clipboard" });
  };

  const onLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <main className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <Button variant="outline" onClick={onLogout}>Logout</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Credits</CardTitle>
            <CardDescription>Manually add credits (no payment)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-3xl font-bold">{credits}</div>
            <div className="flex gap-2">
              <Input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
              <Button onClick={onAddCredits}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {[100, 200, 500, 1000].map((v) => (
                <Button key={v} variant="secondary" onClick={() => quickSet(v)}>
                  +{v}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Token</CardTitle>
            <CardDescription>Generate and copy your extension token</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Input readOnly value={token || "No token generated yet"} />
              <Button variant="secondary" onClick={onGenerate}>Generate</Button>
              <Button onClick={onCopy} disabled={!token}>Copy</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Dashboard;
