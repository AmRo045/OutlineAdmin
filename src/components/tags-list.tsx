"use client";

import {
    Button,
    Input,
    Link,
    Pagination,
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Tooltip,
    useDisclosure
} from "@heroui/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Tag } from "@prisma/client";

import { PAGE_SIZE } from "@/src/core/config";
import { DeleteIcon, EditIcon, PlusIcon } from "@/src/components/icons";
import NoResult from "@/src/components/no-result";
import ConfirmModal from "@/src/components/modals/confirm-modal";
import { deleteTag, getTags, getTagsCount } from "@/src/core/actions/tags";

interface Props {
    data: Tag[];
}

interface SearchFormProps {
    term: string;
}

export default function TagsList({ data }: Props) {
    const [tags, setTags] = useState<Tag[]>(data);
    const [page, setPage] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [tag, setTag] = useState<Tag>();
    const deleteConfirmModalDisclosure = useDisclosure();

    const handleDelete = async () => {
        if (!tag) return;

        await deleteTag(tag.id);
        await updateData();
    };

    const totalPage = Math.ceil(totalItems / PAGE_SIZE);

    const searchForm = useForm<SearchFormProps>();
    const handleSearch = async (data: SearchFormProps) => {
        const params = {
            term: data.term
        };

        const filteredServers = await getTags(params);
        const total = await getTagsCount(params);

        setTotalItems(total);
        setTags(filteredServers);
        setPage(1);
    };

    const updateData = async () => {
        const params = { skip: (page - 1) * PAGE_SIZE, term: searchForm.getValues("term") };

        setIsLoading(true);

        try {
            const data = await getTags(params);

            setTags(data);

            const count = await getTagsCount(params);

            setTotalItems(count);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        updateData();
    }, [page]);

    return (
        <>
            <ConfirmModal
                body={
                    <div className="grid gap-2">
                        <span>
                            Are you sure you want to delete <q>{tag?.name}</q> tag?
                        </span>
                    </div>
                }
                confirmLabel="Remove"
                disclosure={deleteConfirmModalDisclosure}
                title="Delete Tag"
                onConfirm={handleDelete}
            />

            <div className="grid gap-4">
                <section className="flex justify-start items-center gap-2">
                    <h1 className="text-xl">Tags</h1>
                </section>

                <div className="flex justify-between items-center gap-2">
                    <form onSubmit={searchForm.handleSubmit(handleSearch)}>
                        <Input
                            className="w-fit"
                            placeholder="Name [+Enter]"
                            startContent={<>🔍</>}
                            variant="faded"
                            {...searchForm.register("term")}
                        />
                    </form>

                    <Button
                        as={Link}
                        color="primary"
                        href="/tags/create"
                        startContent={<PlusIcon size={20} />}
                        variant="shadow"
                    >
                        Add
                    </Button>
                </div>

                <Table
                    aria-label="Tags list"
                    bottomContent={
                        totalPage > 1 && (
                            <div className="flex justify-center">
                                <Pagination initialPage={page} total={totalPage} variant="light" onChange={setPage} />
                            </div>
                        )
                    }
                    color="primary"
                    isCompact={false}
                    isHeaderSticky={true}
                    isStriped={true}
                    shadow="sm"
                >
                    <TableHeader>
                        <TableColumn>ID</TableColumn>
                        <TableColumn>NAME</TableColumn>
                        <TableColumn align="center">ACTIONS</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent={<NoResult />} isLoading={isLoading} loadingContent={<Spinner />}>
                        {tags.map((tag) => (
                            <TableRow key={tag.id}>
                                <TableCell>{tag.id}</TableCell>
                                <TableCell>{tag.name}</TableCell>

                                <TableCell>
                                    <div className="flex gap-2 justify-center items-center">
                                        <Tooltip closeDelay={100} color="primary" content="Edit" delay={600} size="sm">
                                            <Button
                                                as={Link}
                                                color="primary"
                                                href={`/tags/${tag.id}/edit`}
                                                isIconOnly={true}
                                                size="sm"
                                                variant="light"
                                            >
                                                <EditIcon size={24} />
                                            </Button>
                                        </Tooltip>

                                        <Tooltip closeDelay={100} color="danger" content="Delete" delay={600} size="sm">
                                            <Button
                                                color="danger"
                                                isIconOnly={true}
                                                size="sm"
                                                variant="light"
                                                onPress={() => {
                                                    setTag(() => tag);
                                                    deleteConfirmModalDisclosure.onOpen();
                                                }}
                                            >
                                                <DeleteIcon size={24} />
                                            </Button>
                                        </Tooltip>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}
