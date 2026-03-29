import Navbar from "./layout/Navbar";

const LoadingState = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground text-sm">Loading dashboard…</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
