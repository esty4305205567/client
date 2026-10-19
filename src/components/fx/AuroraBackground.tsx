// רקע חי לכל האפליקציה: שני כתמי אור ירוקים שנעים לאט ורשת שנמוגה כלפי מטה (בסגנון Aceternity Aurora).
export function AuroraBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute -start-40 -top-48 h-[36rem] w-[36rem] animate-aurora-a rounded-full bg-primary/[0.14] blur-[130px]" />
      <div className="absolute -end-48 top-1/3 h-[32rem] w-[32rem] animate-aurora-b rounded-full bg-emerald-400/[0.09] blur-[130px]" />
      <div
        className="absolute inset-0 opacity-70 [background-image:linear-gradient(hsl(0_0%_100%/0.045)_1px,transparent_1px),linear-gradient(90deg,hsl(0_0%_100%/0.045)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,black_20%,transparent_75%)]"
      />
    </div>
  );
}
