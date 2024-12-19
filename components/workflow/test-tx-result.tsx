import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "../ui/button";

export function TestTxResult(props: {
  message: Record<string, any>;
  open: boolean;
  onOpenChange: (_o: boolean) => void;
  sureAction: () => void;
}) {
  const { message, sureAction, ...reset } = props;

  const handleSure = () => {
    props.onOpenChange(false);
    sureAction();
  };

  return (
    <Dialog {...reset}>
      <DialogContent
        title={message?.gasInsufficient ? "Gas Insufficient" : "Text Tx"}
        showClose={true}
        className="md:w-[600px]"
      >
        {message?.gasInsufficient ? (
          <div className="text-center">
            <div className="mt-2 text-lg text-content-color">
              insufficient gas for the task, confirm?
            </div>
            <div className="mt-5 flex justify-center gap-x-2">
              <Button onClick={handleSure}>Sure</Button>
              <Button
                variant="outline"
                onClick={() => props.onOpenChange(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 px-5">
            <div>
              <div className="text-sm text-content-color">transaction_hash</div>
              <div className="break-all">
                {message?.signed_message?.transaction_hash}
              </div>
            </div>
            <div>
              <div className="text-sm text-content-color">estimate_gas</div>
              <div>{Number(message?.gas)}</div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
