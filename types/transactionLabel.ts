export interface CreateTransactionLabelDto {
    key: string;
    items: string[];
    query: string;
}

export interface UpdateTransactionLabelDto
    extends Partial<CreateTransactionLabelDto> {}

export interface TransactionLabel {
    id: string;
    key: string;
    items: string[];
    query: string;
    createdAt: string;
    updatedAt: string;
}