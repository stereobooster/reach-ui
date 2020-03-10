import React, { useRef, useState } from "react";
import { axe } from "jest-axe";
import { render, fireEvent, act } from "$test/utils";
import {
  AlertDialog,
  AlertDialogLabel,
  AlertDialogDescription,
} from "@reach/alert-dialog";

describe("<AlertDialog />", () => {
  it("should not have basic a11y issues", async () => {
    let { container, getByText, getByTestId } = render(<BasicAlertDialog />);
    let results = await axe(container);
    expect(results).toHaveNoViolations();

    act(() => void fireEvent.click(getByText("Show Dialog")));
    let newResults = await axe(getByTestId("dialog"));
    expect(newResults).toHaveNoViolations();
  });

  it("should open the dialog", () => {
    const { baseElement, asFragment, getByText } = render(<BasicAlertDialog />);
    expect(asFragment()).toMatchSnapshot();
    let openButton = getByText("Show Dialog");
    fireEvent.click(openButton);
    expect(baseElement).toMatchSnapshot();
  });

  it("should have the correct label", () => {
    const { baseElement, getByText } = render(<BasicAlertDialog />);
    let openButton = getByText("Show Dialog");
    fireEvent.click(openButton);
    let dialogLabel = baseElement.querySelector(
      "[data-reach-alert-dialog-label]"
    );
    let dialogElement = baseElement.querySelector(
      "[data-reach-alert-dialog-content]"
    );
    let dialogLabelId = dialogLabel?.id;
    expect(dialogElement).toHaveAttribute("aria-labelledby", dialogLabelId);
  });
});

////////////////////////////////////////////////////////////////////////////////
function BasicAlertDialog() {
  const close = useRef(null);
  const [showDialog, setShowDialog] = useState(false);
  return (
    <div>
      <button onClick={() => setShowDialog(true)}>Show Dialog</button>
      {showDialog && (
        <AlertDialog
          leastDestructiveRef={close}
          data-testid="dialog"
          id="great-work"
        >
          <AlertDialogLabel>Confirmation!</AlertDialogLabel>
          <AlertDialogDescription>
            Are you sure you want to have that milkshake?
          </AlertDialogDescription>
          <p>
            <button>Do nothing here</button>{" "}
            <button ref={close} onClick={() => setShowDialog(false)}>
              Cancel
            </button>
          </p>
        </AlertDialog>
      )}
    </div>
  );
}
