// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
	integrations: [
		starlight({
			title: 'Boldie',
			description: 'How to use Boldie: the calendar, clients, online booking, messages and the staff apps.',
			favicon: '/favicon.ico',
			customCss: ['./src/styles/boldie.css'],
			lastUpdated: false,
			pagination: true,
			sidebar: [
				{
					label: 'Start',
					items: ['getting-started', 'roles'],
				},
				{
					label: 'Web app',
					items: [
						'calendar',
						'services-and-resources',
						'clients',
						'import-and-export',
						'online-booking',
						'notifications',
						'marketing',
						'forms',
						'reports',
						'billing',
						'calendar-subscription',
						'team',
						'settings',
					],
				},
				{
					label: 'Phone apps',
					items: ['staff-apps', 'push-alerts'],
				},
				{
					label: 'Tutorials',
					items: ['tutorials'],
				},
				{
					label: 'Help',
					items: ['troubleshooting', 'not-yet'],
				},
			],
		}),
	],
});
