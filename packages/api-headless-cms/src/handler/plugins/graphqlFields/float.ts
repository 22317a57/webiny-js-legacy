import gql from "graphql-tag";
import { CmsModelFieldToGraphQLPlugin } from "@webiny/api-headless-cms/types";

const createListFilters = ({ field }) => {
    return `
        # Matches if the field is equal to the given value
        ${field.fieldId}: Float
        
        # Matches if the field is not equal to the given value
        ${field.fieldId}_not: Float

        
        # Matches if the field value equal one of the given values
        ${field.fieldId}_in: [Float]
        
        # Matches if the field value does not equal any of the given values
        ${field.fieldId}_not_in: [Float]
        
        # Matches if the field value is strictly smaller than the given value
        ${field.fieldId}_lt: Float
        
        # Matches if the field value is smaller than or equal to the given value
        ${field.fieldId}_lte: Float
        
        # Matches if the field value is strictly greater than the given value
        ${field.fieldId}_gt: Float
        
        # Matches if the field value is greater than or equal to the given value
        ${field.fieldId}_gte: Float
    `;
};

const plugin: CmsModelFieldToGraphQLPlugin = {
    name: "cms-model-field-to-graphql-float",
    type: "cms-model-field-to-graphql",
    fieldType: "float",
    isSortable: true,
    read: {
        createListFilters,
        createResolver({ field }) {
            return (instance, args) => {
                return instance[field.fieldId].value(args.locale);
            };
        },
        createTypeField({ field }) {
            const localeArg = "(locale: String)";
            return `${field.fieldId}${localeArg}: Float`;
        }
    },
    manage: {
        createListFilters,
        createResolver({ field }) {
            return instance => {
                return instance[field.fieldId];
            };
        },
        createSchema() {
            return {
                typeDefs: gql`
                    input CmsFloatLocalizedInput {
                        value: Float
                        locale: ID!
                    }

                    input CmsFloatInput {
                        values: [CmsFloatLocalizedInput]
                    }

                    type CmsFloatLocalized {
                        value: Float
                        locale: ID!
                    }

                    type CmsFloat {
                        value: Float
                        values: [CmsFloatLocalized]!
                    }
                `
            };
        },
        createTypeField({ field }) {
            return field.fieldId + ": CmsFloat";
        },
        createInputField({ field }) {
            return field.fieldId + ": CmsFloatInput";
        }
    }
};

export default plugin;
