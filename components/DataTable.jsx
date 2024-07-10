"use client";

import * as React from "react";
import { CaretSortIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { currencyMapping } from "@/lib/utils";
import { useState } from "react";

export function DataTable({ data, brands, lang }) {
	const [sorting, setSorting] = useState([]);
	const [columnFilters, setColumnFilters] = useState([]);
	const [columnVisibility, setColumnVisibility] = useState({});
	const [rowSelection, setRowSelection] = useState({});
	const [currentPage, setCurrentPage] = useState(1);

	const columns = [
		{
			accessorKey: "variantId",
			filterFn: (row, columnId, filterValue) => {
				return row.getValue(columnId).toString().includes(filterValue);
			},
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						className="hover:bg-transparent p-0"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						ID
						<CaretSortIcon className="ml-2 h-4 w-4" />
					</Button>
				);
			},
			cell: ({ row }) => <div className="capitalize">{row.getValue("variantId")}</div>,
		},
		{
			accessorKey: "sku",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						className="hover:bg-transparent p-0"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						SKU
						<CaretSortIcon className="ml-2 h-4 w-4" />
					</Button>
				);
			},
			cell: ({ row }) => <div className="capitalize">{row.getValue("sku")}</div>,
		},
		{
			accessorKey: "ean",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						className="hover:bg-transparent p-0"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						EAN
						<CaretSortIcon className="ml-2 h-4 w-4" />
					</Button>
				);
			},
			cell: ({ row }) => <div className="capitalize">{row.getValue("ean")}</div>,
		},
		{
			accessorKey: "brand",
			filterFn: (row, columnId, filterValue) => {
				return row.getValue("brand") === filterValue;
			},
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						className="hover:bg-transparent p-0"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						BRAND
						<CaretSortIcon className="ml-2 h-4 w-4" />
					</Button>
				);
			},
			cell: ({ row }) => <div className="capitalize">{row.getValue("brand")}</div>,
		},
		{
			accessorKey: "name",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						className="hover:bg-transparent p-0"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						TITLE
						<CaretSortIcon className="ml-2 h-4 w-4" />
					</Button>
				);
			},
			cell: ({ row }) => <div>{row.getValue("name")}</div>,
		},
		{
			accessorKey: "price",
			header: () => <div className="text-right pr-[16px]">PRICE</div>,
			cell: ({ row }) => {
				const amount = row.getValue("price");

				const setPrice = (item) => {
					const { newPrice, oldPrice } = item;
					const price = new Intl.NumberFormat(currencyMapping(lang).locale, {
						style: "currency",
						currency: currencyMapping(lang).currency,
					}).format(newPrice);

					if (oldPrice !== 0) {
						if (newPrice > oldPrice)
							return {
								price: price + " ▲",
								style: "text-green-600",
							};
						if (newPrice < oldPrice)
							return {
								price: price + " ▼",
								style: "text-red-600",
							};
					}
					return { price: price, style: "text-black pr-[16px]" };
				};

				return (
					<div className={`text-right font-medium ${setPrice(amount).style}`}>
						{setPrice(amount).price}
					</div>
				);
			},
		},
	];

	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
		initialState: {
			pagination: {
				pageSize: 200,
			},
		},
	});

	return (
		<div className="w-full relative">
			<div className="flex items-center py-4 px-10 fixed top-0 left-0 right-0 bg-neutral-100 z-10">
				<Input
					placeholder="Filter ID..."
					value={table.getColumn("variantId")?.getFilterValue() ?? ""}
					onChange={(event) =>
						table.getColumn("variantId")?.setFilterValue(event.target.value)
					}
					className="max-w-sm mr-4 bg-white"
				/>

				<Input
					placeholder="Filter SKU..."
					value={table.getColumn("sku")?.getFilterValue() ?? ""}
					onChange={(event) => table.getColumn("sku")?.setFilterValue(event.target.value)}
					className="max-w-sm mr-4 bg-white"
				/>

				<Input
					placeholder="Filter EAN..."
					value={table.getColumn("ean")?.getFilterValue() ?? ""}
					onChange={(event) => table.getColumn("ean")?.setFilterValue(event.target.value)}
					className="max-w-sm mr-4 bg-white"
				/>
				<DropdownMenu className>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="ml-auto mr-4 bg-white">
							{typeof table.getColumn("brand")?.getFilterValue() === "undefined"
								? "Brands"
								: table.getColumn("brand")?.getFilterValue()}{" "}
							<ChevronDownIcon className="ml-2 h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuCheckboxItem
							checked={
								typeof table.getColumn("brand")?.getFilterValue() === "undefined"
							}
							onCheckedChange={() => {
								table.getColumn("brand")?.setFilterValue("");
							}}
						>
							All
						</DropdownMenuCheckboxItem>
						{brands.map((brand, key) => {
							return (
								<DropdownMenuCheckboxItem
									key={key}
									className="uppercase"
									checked={
										table.getColumn("brand")?.getFilterValue() === brand.name
									}
									onCheckedChange={() => {
										table.getColumn("brand")?.setFilterValue(brand.name);
									}}
								>
									{brand.name}
								</DropdownMenuCheckboxItem>
							);
						})}
					</DropdownMenuContent>
				</DropdownMenu>

				<Input
					placeholder="Filter Title..."
					value={table.getColumn("name")?.getFilterValue() ?? ""}
					onChange={(event) =>
						table.getColumn("name")?.setFilterValue(event.target.value)
					}
					className="max-w-sm mr-4 bg-white"
				/>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="ml-auto bg-white">
							Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						{table
							.getAllColumns()
							.filter((column) => column.getCanHide())
							.map((column) => {
								return (
									<DropdownMenuCheckboxItem
										key={column.id}
										className="uppercase"
										checked={column.getIsVisible()}
										onCheckedChange={(value) =>
											column.toggleVisibility(!!value)
										}
									>
										{column.id}
									</DropdownMenuCheckboxItem>
								);
							})}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow className="hover:bg-white" key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
												  )}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
									className="even:bg-neutral-200"
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex flex-col items-center gap-2 fixed bottom-0 left-0 right-0 bg-neutral-100 justify-end space-x-2 py-4 px-8">
				<div className="flex justify-between items-center text-sm text-muted-foreground w-full">
					<span>{table.getFilteredRowModel().rows.length} found.</span>
					<div>
						Page {currentPage} of {table.getPageCount()}
					</div>
				</div>
				<div>
					<div className="flex flex-wrap gap-1 mb-2">
						{Array.from(Array(table.getPageCount()).keys()).map((pageNumber) => {
							return (
								<Button
									key={pageNumber + 1}
									variant="outline"
									size="sm"
									className={
										pageNumber + 1 === currentPage
											? "bg-neutral-950 text-white w-8 p-0"
											: "bg-white w-8 p-0"
									}
									onClick={() => {
										table.setPageIndex(pageNumber);
										setCurrentPage(pageNumber + 1);
									}}
								>
									{pageNumber + 1}
								</Button>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}
