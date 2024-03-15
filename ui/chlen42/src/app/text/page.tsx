"use client";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import React, { useEffect, useState } from "react";

function TextViewPage() {
  const [selection, setSelection] = useState("");

  useEffect(() => {
    const handleSelectionChange = () => {
      const selectedText = window.getSelection()?.toString() ?? "";
      setSelection(selectedText);
    };

    document.addEventListener("selectionchange", handleSelectionChange);

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="container mx-auto mt-8">
          Чл. 86. (1) Регистрирано лице, за което данъкът е станал изискуем, е
          длъжно да го начисли, като: 1. издаде данъчен документ, в който посочи
          данъка на отделен ред; 2. включи размера на данъка при определяне на
          резултата за съответния данъчен период в справка-декларацията по чл.
          125 за този данъчен период; 3. посочи документа по т. 1 в дневника за
          продажбите за съответния данъчен период. (2) Данъкът е дължим от
          регистрираното лице за данъчния период, през който е издаден данъчният
          документ, а в случаите, когато не е издаден такъв документ или не е
          издаден в срока по този закон - за данъчния период, през който данъкът
          е станал изискуем.
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>{selection}</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export default TextViewPage;
