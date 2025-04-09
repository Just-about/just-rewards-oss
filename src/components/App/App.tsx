import classNames from "classnames";
import { type PropsWithChildren } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { Header } from "~components/Header";
import { RouterOutlet } from "~components/RouterOutlet";
import { UserInfo } from "~components/UserInfo";

interface AppProps extends PropsWithChildren {
  onClose?: () => void;
  className?: string;
}

const fallbackRender = ({ error }: { error: Error }) => {
  return (
    <div role="alert" className="font-['BasicSans'] p-4">
      <p className="text-white">Something went wrong:</p>
      <pre className="text-red-600 overflow-scroll">{error.stack}</pre>
    </div>
  );
};

export const AppWrapper = ({
  children,
  onClose,
  className,
}: {
  children?: React.ReactNode;
  onClose?: () => void;
  className?: string;
}) => {
  return (
    <div
      className="h-[600px] max-h-[600px] w-[340px] flex flex-col overflow-hidden antialiased"
      style={{ background: "linear-gradient(180deg, #16151F 0%, #252435 100%)" }}
    >
      <ErrorBoundary fallbackRender={fallbackRender}>
        <Header onClose={onClose} />

        <div className={classNames("flex-shrink overflow-hidden")}>{children}</div>

        <UserInfo className="flex-shrink-0 mt-auto" />
      </ErrorBoundary>
    </div>
  );
};

export const App = ({ onClose, className }: AppProps) => {
  return (
    <AppWrapper className={className} onClose={onClose}>
      <RouterOutlet />
    </AppWrapper>
  );
};
