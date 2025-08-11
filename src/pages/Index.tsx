// Landing page
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const Index = () => {
  useEffect(() => {
    document.title = "Home | Gmail Extension Web";
    const meta = document.querySelector('meta[name="description"]');
    const content = "Frontend-only app for Gmail extension: login, credits, token.";
    if (meta) meta.setAttribute("content", content);
    else {
      const m = document.createElement("meta");
      m.name = "description";
      m.content = content;
      document.head.appendChild(m);
    }
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Gmail Extension Web</h1>
        <p className="text-xl text-muted-foreground">Login, add credits, and generate your API token.</p>
        <div className="flex items-center justify-center">
          <Link to="/auth">
            <Button>Go to Login / Signup</Button>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Index;
