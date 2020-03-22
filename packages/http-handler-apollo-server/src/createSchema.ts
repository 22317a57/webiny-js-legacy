import { applyMiddleware } from "graphql-middleware";
import { addSchemaLevelResolveFunction } from "graphql-tools";
import { GraphQLSchema } from "graphql";
import { PluginsContainer, GraphQLMiddlewarePlugin, GraphQLContext } from "../types";
import { prepareSchema } from "./createSchema/prepareSchema";
import { applyGraphQLContextPlugins } from "./createSchema/contextPlugins";

type CreateHandlerParams = {
    plugins: PluginsContainer;
};

/**
 * Create graphql schema only
 * @param plugins
 * @returns {Promise<void>}
 */
const createSchema = async ({
    plugins
}: CreateHandlerParams): Promise<{ schema: GraphQLSchema; context: GraphQLContext }> => {
    // eslint-disable-next-line prefer-const
    let { schema, context } = await prepareSchema({ plugins });

    const registeredMiddleware = [];

    const middlewarePlugins = plugins.byType<GraphQLMiddlewarePlugin>("graphql-middleware");
    for (let i = 0; i < middlewarePlugins.length; i++) {
        const plugin = middlewarePlugins[i];
        const middleware =
            typeof plugin.middleware === "function"
                ? await plugin.middleware({ plugins })
                : plugin.middleware;
        if (Array.isArray(middleware)) {
            registeredMiddleware.push(...middleware);
        } else {
            registeredMiddleware.push(middleware);
        }
    }

    if (registeredMiddleware.length) {
        schema = applyMiddleware(schema, ...registeredMiddleware);
    }

    addSchemaLevelResolveFunction(schema, async (root, args, context, info) => {
        // Make sure we do not block this resolver from processing subsequent requests!
        // This is something that is baked into the graphql-tools and cannot be avoided another way.
        delete info.operation["__runAtMostOnce"];

        // Process `graphql-context` plugins
        await applyGraphQLContextPlugins(context);
    });

    return { schema, context };
};

export default createSchema;
