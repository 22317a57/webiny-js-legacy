import { ListResponse, ListErrorResponse } from "@webiny/commodo-graphql";
import { GraphQLFieldResolver } from "@webiny/api/types";
import { setContextLocale } from "./setContextLocale";
import findEntries from "./findEntries";
import { CmsGraphQLContext } from "@webiny/api-headless-cms/types";

export const resolveList = ({ model }): GraphQLFieldResolver<any, any, CmsGraphQLContext> => async (
    entry,
    args,
    context
) => {
    setContextLocale(context, args.locale);
    try {
        const { entries, meta } = await findEntries({ model, args, context });
        return new ListResponse(entries, meta);
    } catch (err) {
        return new ListErrorResponse({ code: err.code || "RESOLVE_LIST", message: err.message });
    }
};
