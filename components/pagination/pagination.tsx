import React from "react";
import usePagination from "./use-pagination";
import {
  IPagination,
  IPaginationProps,
  ButtonProps,
  PageButtonProps,
} from "./types";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export const PrevButton = ({ className, ...buttonProps }: ButtonProps) => {
  const pagination = React.useContext(PaginationContext);
  const previous = () => {
    if (pagination.currentPage + 1 > 1) {
      pagination.setCurrentPage(pagination.currentPage - 1);
    }
  };

  const disabled = pagination.currentPage === 0;

  return (
    <button
      {...buttonProps}
      className={cn(
        "text-lightgray group flex h-10 w-[52px] items-center justify-center rounded-lg bg-white text-sm leading-5 hover:border hover:border-[#0572EC] hover:text-[#0572EC] data-[active=true]:border data-[active=true]:border-[#0572EC] data-[active=true]:text-[#0572EC]",
        className,
      )}
      onClick={() => previous()}
      tabIndex={disabled ? -1 : 0}
      disabled={disabled}
      onKeyDown={(event: React.KeyboardEvent) => {
        event.preventDefault();
        if (event.key === "Enter" && !disabled) {
          previous();
        }
      }}
    >
      <ArrowRight className="h-5 w-5 rotate-180" />
    </button>
  );
};

export const NextButton = ({ className, ...buttonProps }: ButtonProps) => {
  const pagination = React.useContext(PaginationContext);
  const next = () => {
    if (pagination.currentPage + 1 < pagination.pages.length) {
      pagination.setCurrentPage(pagination.currentPage + 1);
    }
  };

  const disabled = pagination.currentPage === pagination.pages.length - 1;

  return (
    <button
      {...buttonProps}
      className={cn(
        "text-lightgray flex h-10 w-[52px] items-center justify-center rounded-lg bg-white text-sm leading-5 hover:border hover:border-[#0572EC] hover:text-[#0572EC] data-[active=true]:border data-[active=true]:border-[#0572EC] data-[active=true]:text-[#0572EC]",
        className,
      )}
      onClick={() => next()}
      tabIndex={disabled ? -1 : 0}
      disabled={disabled}
      onKeyDown={(event: React.KeyboardEvent) => {
        event.preventDefault();
        if (event.key === "Enter" && !disabled) {
          next();
        }
      }}
    >
      <ArrowRight className="w- h-5 " />
    </button>
  );
};

type ITruncableElementProps = {
  prev?: boolean;
};

const TruncableElement = ({ prev }: ITruncableElementProps) => {
  const pagination: IPagination = React.useContext(PaginationContext);

  const { isPreviousTruncable, isNextTruncable } = pagination;

  return (isPreviousTruncable && prev === true) ||
    (isNextTruncable && !prev) ? (
    <li className="list-none">
      <a
        className={cn(
          "text-lightgray flex h-10 w-10 items-center justify-center rounded-lg bg-white text-sm leading-5 data-[active=true]:border data-[active=true]:border-[#0572EC] data-[active=true]:text-[#0572EC]",
        )}
      >
        ...
      </a>
    </li>
  ) : null;
};

export const PageButton = ({ className }: PageButtonProps) => {
  const pagination: IPagination = React.useContext(PaginationContext);

  const renderPageButton = (page: number) => (
    <li key={page} className="list-none">
      <a
        tabIndex={0}
        onKeyDown={(event: React.KeyboardEvent) => {
          if (event.key === "Enter") {
            pagination.setCurrentPage(page - 1);
          }
        }}
        onClick={() => pagination.setCurrentPage(page - 1)}
        data-active={pagination.currentPage + 1 === page}
        className={cn(
          "text-lightgray flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-white text-sm leading-5 data-[active=true]:border data-[active=true]:border-[#0572EC] data-[active=true]:text-[#0572EC]",
          className,
        )}
      >
        {page}
      </a>
    </li>
  );

  return (
    <>
      {pagination.previousPages.map(renderPageButton)}
      <TruncableElement prev />
      {pagination.middlePages.map(renderPageButton)}
      <TruncableElement />
      {pagination.nextPages.map(renderPageButton)}
    </>
  );
};

const defaultState: IPagination = {
  currentPage: 0,
  setCurrentPage: () => {},
  pages: [],
  hasPreviousPage: false,
  hasNextPage: false,
  previousPages: [],
  isPreviousTruncable: false,
  middlePages: [],
  isNextTruncable: false,
  nextPages: [],
};

const PaginationContext: React.Context<IPagination> =
  React.createContext<IPagination>(defaultState);

export const Pagination = ({ ...paginationProps }: IPaginationProps) => {
  const pagination = usePagination(paginationProps);

  return (
    <PaginationContext.Provider value={pagination}>
      <div
        className={cn(
          "my-4 flex w-full items-center justify-around px-3",
          paginationProps.className,
        )}
      >
        {paginationProps.children}
      </div>
    </PaginationContext.Provider>
  );
};

Pagination.PrevButton = PrevButton;
Pagination.NextButton = NextButton;
Pagination.PageButton = PageButton;
