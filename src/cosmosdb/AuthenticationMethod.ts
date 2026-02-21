/*---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import vscode from 'vscode';
import { ext } from '../extensionVariables';

export enum AuthenticationMethod {
    auto = 'auto',
    accountKey = 'accountKey',
    entraId = 'entraId',
    managedIdentity = 'managedIdentity',
}

/**
 * Retrieves the user's preferred authentication method for Cosmos DB from settings,
 * handling migrations from deprecated OAuth settings if necessary.
 */
export function getPreferredAuthenticationMethod(): AuthenticationMethod {
    const configuration = vscode.workspace.getConfiguration();

    // Migrate old setting if it exists
    const deprecatedOauthSetting = configuration.get<boolean>('azureDatabases.useCosmosOAuth');
    let preferredAuthMethod = configuration.get<AuthenticationMethod>(
        ext.settingsKeys.cosmosDbAuthentication,
        AuthenticationMethod.auto,
    );

    if (deprecatedOauthSetting) {
        if (preferredAuthMethod === AuthenticationMethod.auto) {
            preferredAuthMethod = AuthenticationMethod.entraId;
            // Update the new setting and clear the old one
            configuration.update(ext.settingsKeys.cosmosDbAuthentication, preferredAuthMethod, true);
        }
        configuration.update('azureDatabases.useCosmosOAuth', undefined, true);
    }

    return preferredAuthMethod;
}
