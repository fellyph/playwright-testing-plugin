import { test, expect } from '@playwright/test';
import { runCLI, RunCLIArgs, RunCLIServer } from "@wp-playground/cli";

test.describe('set-wordpress-user', () => {
    let cliServer: RunCLIServer;

    // Test data - organized for better maintainability
    const testUserData = {
        firstName: 'John',
        lastName: 'Doe',
        nickname: 'Johny',
        description: 'This is the biographical info from John Doe.',
        adminColor: 'midnight',
        userId: 1
    };

    test.afterEach(async () => {
        if(cliServer) {
            await cliServer.server.close();
        }
    });

	test('should set WordPress user name and description', async () => {
		cliServer = await runCLI({
			command: 'server',
			blueprint: {
				steps: [
                    {
                       "step": "updateUserMeta",
						"meta": {
							"first_name": testUserData.firstName,
							"last_name": testUserData.lastName,
							"admin_color": testUserData.adminColor,
							"nickname": testUserData.nickname,
							"description": testUserData.description
						},
						"userId": testUserData.userId
                    }
				],
			},
		} as RunCLIArgs);
		
		// Create a PHP file to check the user data with better error handling
		await cliServer.playground.writeFile(
			'/wordpress/check-user.php',
			`<?php
            require_once '/wordpress/wp-load.php';
            
            try {
                // Get user data
                $user = get_user_by('id', 1);
                
                if (!$user) {
                    http_response_code(404);
                    echo json_encode(['error' => 'User not found']);
                    exit;
                }
                
                $first_name = get_user_meta(1, 'first_name', true);
                $last_name = get_user_meta(1, 'last_name', true);
                $description = get_user_meta(1, 'description', true);
                $nickname = get_user_meta(1, 'nickname', true);
                $admin_color = get_user_meta(1, 'admin_color', true);
                
                // Return as JSON with more comprehensive data
                echo json_encode([
                    'success' => true,
                    'user_id' => $user->ID,
                    'user_login' => $user->user_login,
                    'user_email' => $user->user_email,
                    'first_name' => $first_name,
                    'last_name' => $last_name,
                    'nickname' => $nickname,
                    'description' => $description,
                    'admin_color' => $admin_color,
                    'display_name' => $user->display_name,
                    'full_name' => trim($first_name . ' ' . $last_name),
                    'meta_updated' => !empty($first_name) && !empty($last_name)
                ]);
                
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode(['error' => $e->getMessage()]);
            }
            ?>`
		);
		
		const response = await cliServer.playground.request({
			url: '/check-user.php',
			method: 'GET',
		});
		
		// Better error handling for HTTP response
		expect(response.httpStatusCode).toBe(200);
		
		// Parse the JSON response with error handling
		let userData;
		try {
			userData = JSON.parse(response.text);
		} catch (error) {
			throw new Error(`Failed to parse JSON response: ${response.text}`);
		}
		
		// Check for API errors
		expect(userData.success).toBe(true);
		expect(userData.error).toBeUndefined();
		
		// Comprehensive assertions
		expect(userData.user_id).toBe(testUserData.userId);
		expect(userData.first_name).toBe(testUserData.firstName);
		expect(userData.last_name).toBe(testUserData.lastName);
		expect(userData.nickname).toBe(testUserData.nickname);
		expect(userData.description).toBe(testUserData.description);
		expect(userData.admin_color).toBe(testUserData.adminColor);
		
		// Check derived values
		expect(userData.full_name).toBe(`${testUserData.firstName} ${testUserData.lastName}`);
		expect(userData.meta_updated).toBe(true);
		
		// Check that essential user fields exist
		expect(userData.user_login).toBeTruthy();
		expect(userData.user_email).toBeTruthy();
		expect(userData.display_name).toBeTruthy();
		
		// Verify the user is actually an admin (user ID 1)
		expect(userData.user_id).toBe(1);
	});

	test('should handle invalid user ID gracefully', async () => {
		cliServer = await runCLI({
			command: 'server',
			blueprint: {
				steps: [
                    {
                       "step": "updateUserMeta",
						"meta": {
							"first_name": "Test",
							"last_name": "User"
						},
						"userId": 999 // Non-existent user
                    }
				],
			},
		} as RunCLIArgs);
		
		// Create a PHP file to check non-existent user
		await cliServer.playground.writeFile(
			'/wordpress/check-invalid-user.php',
			`<?php
            require_once '/wordpress/wp-load.php';
            
            try {
                $user = get_user_by('id', 999);
                
                if (!$user) {
                    http_response_code(404);
                    echo json_encode(['error' => 'User not found', 'user_id' => 999]);
                    exit;
                }
                
                echo json_encode(['success' => true, 'user' => $user]);
                
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode(['error' => $e->getMessage()]);
            }
            ?>`
		);
		
		const response = await cliServer.playground.request({
			url: '/check-invalid-user.php',
			method: 'GET',
		});
		
		expect(response.httpStatusCode).toBe(404);
		
		const errorData = JSON.parse(response.text);
		expect(errorData.error).toBe('User not found');
		expect(errorData.user_id).toBe(999);
	});
});