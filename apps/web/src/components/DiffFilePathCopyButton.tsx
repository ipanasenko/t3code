import { CheckIcon, CopyIcon } from "lucide-react";
import { type MouseEvent as ReactMouseEvent, type RefObject, useRef } from "react";
import { useCopyToClipboard } from "../hooks/useCopyToClipboard";
import { Button } from "./ui/button";
import { anchoredToastManager } from "./ui/toast";
import { Tooltip, TooltipPopup, TooltipTrigger } from "./ui/tooltip";

const ANCHORED_TOAST_TIMEOUT_MS = 1000;

function showCopySuccessToast(ref: RefObject<HTMLButtonElement | null>) {
  if (!ref.current) return;
  anchoredToastManager.add({
    data: {
      tooltipStyle: true,
    },
    positionerProps: {
      anchor: ref.current,
    },
    timeout: ANCHORED_TOAST_TIMEOUT_MS,
    title: "Copied!",
  });
}

function showCopyErrorToast(ref: RefObject<HTMLButtonElement | null>, error: Error) {
  if (!ref.current) return;
  anchoredToastManager.add({
    data: {
      tooltipStyle: true,
    },
    positionerProps: {
      anchor: ref.current,
    },
    timeout: ANCHORED_TOAST_TIMEOUT_MS,
    title: "Failed to copy",
    description: error.message,
  });
}

export function DiffFilePathCopyButton({ filePath }: { filePath: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  const { copyToClipboard, isCopied } = useCopyToClipboard<void>({
    onCopy: () => showCopySuccessToast(ref),
    onError: (error) => showCopyErrorToast(ref, error),
    timeout: ANCHORED_TOAST_TIMEOUT_MS,
  });

  const onClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    copyToClipboard(filePath, undefined);
  };

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            ref={ref}
            type="button"
            size="icon-xs"
            variant="ghost"
            aria-label="Copy file path"
            title={isCopied ? "Copied" : "Copy file path"}
            onClick={onClick}
          />
        }
      >
        {isCopied ? <CheckIcon className="size-3 text-success" /> : <CopyIcon className="size-3" />}
      </TooltipTrigger>
      <TooltipPopup>
        <p>{isCopied ? "Copied" : "Copy path"}</p>
      </TooltipPopup>
    </Tooltip>
  );
}
