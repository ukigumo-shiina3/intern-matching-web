export default function DebugEnvPage() {
  const envVars = {
    FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "✓ Set" : "✗ Missing",
    FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? "✓ Set" : "✗ Missing",
    FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "✓ Set" : "✗ Missing",
    FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? "✓ Set" : "✗ Missing",
    FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? "✓ Set" : "✗ Missing",
    FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? "✓ Set" : "✗ Missing",
    GRAPHQL_URL: process.env.NEXT_PUBLIC_GRAPHQL_URL ? "✓ Set" : "✗ Missing",
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "monospace" }}>
      <h1>Environment Variables Debug</h1>
      <pre>{JSON.stringify(envVars, null, 2)}</pre>

      <h2>Actual Values (first 20 chars):</h2>
      <pre>
        FIREBASE_PROJECT_ID: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.substring(0, 20) || "undefined"}
        {"\n"}
        GRAPHQL_URL: {process.env.NEXT_PUBLIC_GRAPHQL_URL?.substring(0, 30) || "undefined"}
      </pre>
    </div>
  );
}
