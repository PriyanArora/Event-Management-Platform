import { Container } from '../components/layout/Page';
import { ButtonLink } from '../components/ui/Button';

export function NotFoundPage() {
  return (
    <StatusShell
      code="404"
      title="Page not found"
      description="The page you're looking for doesn't exist or may have moved."
      primary={{ label: 'Back to home', to: '/' }}
      secondary={{ label: 'Browse events', to: '/events' }}
    />
  );
}

export function ForbiddenPage() {
  return (
    <StatusShell
      code="403"
      title="You don't have access"
      description="This area is for a different account role. Sign in with the right account to continue."
      primary={{ label: 'Back to home', to: '/' }}
      secondary={{ label: 'Sign in', to: '/login' }}
    />
  );
}

function StatusShell({
  code,
  title,
  description,
  primary,
  secondary,
}: {
  code: string;
  title: string;
  description: string;
  primary: { label: string; to: string };
  secondary: { label: string; to: string };
}) {
  return (
    <div className="flex min-h-[70vh] items-center bg-paper">
      <Container className="text-center">
        <div className="mx-auto flex max-w-md flex-col items-center">
          <p className="font-mono text-[clamp(4rem,12vw,7rem)] font-medium leading-none tracking-tight text-zinc-200">
            {code}
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink">{title}</h1>
          <p className="mt-3 text-sm text-zinc-500">{description}</p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink to={primary.to}>{primary.label}</ButtonLink>
            <ButtonLink to={secondary.to} variant="outline">{secondary.label}</ButtonLink>
          </div>
        </div>
      </Container>
    </div>
  );
}
