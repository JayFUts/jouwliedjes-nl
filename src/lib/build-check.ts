// Check if we're in build mode
export const isBuildTime = () => {
  return (
    process.env.NEXT_PHASE === 'phase-production-build' ||
    process.env.NETLIFY === 'true' ||
    process.env.BUILD_ID !== undefined ||
    !process.env.RUNTIME_ENV
  );
};