"use client";

import { Fragment, ReactNode } from "react";
import { Dialog, Transition } from "@headlessui/react";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title: string;
  size?: "sm" | "md" | "lg" | "xl" | "xxl";
}

export default function BaseModal({
  isOpen,
  onClose,
  children,
  title,
  size = "md",
}: BaseModalProps) {
  const sizeClasses = {
    sm: "w-96",
    md: "w-[32rem]",
    lg: "w-[46rem]",
    xl: "w-[56rem]",
    xxl: "w-[72rem]",
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto scrollbar-auto-hide"
        onClose={onClose}
      >
        <div className="min-h-screen px-4 text-center">
          <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel
              className={`relative inline-block ${sizeClasses[size]} p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-md`}
            >
              {/* <button
                type="button"
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-500 transition-colors"
                onClick={onClose}
                aria-label="Close modal"
              >
                <X size={20} />
              </button> */}
              <h2 className="text-lg font-bold">{title}</h2>
              <div className="h-[0.5px] w-full bg-gray-400 my-4" />
              {children}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
