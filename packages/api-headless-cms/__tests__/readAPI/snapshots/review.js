export default /* GraphQL */ `
    "Product review"
    type Review {
        id: ID
        createdBy: SecurityUser
        updatedBy: SecurityUser
        createdOn: DateTime
        updatedOn: DateTime
        savedOn: DateTime
        text(locale: String): String
        product(locale: String): Product
        rating(locale: String): Float
    }

    input ReviewGetWhereInput {
        id: ID!
    }

    input ReviewListWhereInput {
        id: ID
        id_not: ID
        id_in: [ID]
        id_not_in: [ID]

        # Matches if the field is equal to the given value
        text: String

        # Matches if the field is not equal to the given value
        text_not: String

        # Matches if the field value equal one of the given values
        text_in: [String]

        # Matches if the field value does not equal any of the given values
        text_not_in: [String]

        # Matches if given value is a substring of the the field value
        text_contains: String

        # Matches if given value is not a substring of the the field value
        text_not_contains: String

        # Matches if the field is equal to the given value
        rating: Float

        # Matches if the field is not equal to the given value
        rating_not: Float

        # Matches if the field value equal one of the given values
        rating_in: [Float]

        # Matches if the field value does not equal any of the given values
        rating_not_in: [Float]

        # Matches if the field value is strictly smaller than the given value
        rating_lt: Float

        # Matches if the field value is smaller than or equal to the given value
        rating_lte: Float

        # Matches if the field value is strictly greater than the given value
        rating_gt: Float

        # Matches if the field value is greater than or equal to the given value
        rating_gte: Float
    }

    enum ReviewListSorter {
        createdOn_ASC
        createdOn_DESC
        updatedOn_ASC
        updatedOn_DESC
        text_ASC
        text_DESC
        rating_ASC
        rating_DESC
    }

    type ReviewResponse {
        data: Review
        error: CmsError
    }

    type ReviewListResponse {
        data: [Review]
        meta: CmsListMeta
        error: CmsError
    }

    extend type Query {
        getReview(locale: String, where: ReviewGetWhereInput!): ReviewResponse

        listReviews(
            locale: String
            page: Int
            perPage: Int
            where: ReviewListWhereInput
            sort: [ReviewListSorter]
        ): ReviewListResponse
    }
`;
