// Block letter patterns for 'BLOCKENSPIEL'
// Each letter is defined as a 2D array where 1 means place a block, 0 means empty space
// Letters are designed to be 7 blocks tall and varying widths for readability

class LogoPatterns {
    static getLetterPatterns() {
        return {
            B: [
                [1, 1, 1, 1, 0],
                [1, 0, 0, 0, 1],
                [1, 0, 0, 0, 1],
                [1, 1, 1, 1, 0],
                [1, 0, 0, 0, 1],
                [1, 0, 0, 0, 1],
                [1, 1, 1, 1, 0]
            ],
            L: [
                [1, 0, 0, 0],
                [1, 0, 0, 0],
                [1, 0, 0, 0],
                [1, 0, 0, 0],
                [1, 0, 0, 0],
                [1, 0, 0, 0],
                [1, 1, 1, 1]
            ],
            O: [
                [0, 1, 1, 1, 0],
                [1, 0, 0, 0, 1],
                [1, 0, 0, 0, 1],
                [1, 0, 0, 0, 1],
                [1, 0, 0, 0, 1],
                [1, 0, 0, 0, 1],
                [0, 1, 1, 1, 0]
            ],
            C: [
                [0, 1, 1, 1, 0],
                [1, 0, 0, 0, 1],
                [1, 0, 0, 0, 0],
                [1, 0, 0, 0, 0],
                [1, 0, 0, 0, 0],
                [1, 0, 0, 0, 1],
                [0, 1, 1, 1, 0]
            ],
            K: [
                [1, 0, 0, 0, 1],
                [1, 0, 0, 1, 0],
                [1, 0, 1, 0, 0],
                [1, 1, 0, 0, 0],
                [1, 0, 1, 0, 0],
                [1, 0, 0, 1, 0],
                [1, 0, 0, 0, 1]
            ],
            E: [
                [1, 1, 1, 1, 1],
                [1, 0, 0, 0, 0],
                [1, 0, 0, 0, 0],
                [1, 1, 1, 1, 0],
                [1, 0, 0, 0, 0],
                [1, 0, 0, 0, 0],
                [1, 1, 1, 1, 1]
            ],
            N: [
                [1, 0, 0, 0, 1],
                [1, 1, 0, 0, 1],
                [1, 0, 1, 0, 1],
                [1, 0, 0, 1, 1],
                [1, 0, 0, 0, 1],
                [1, 0, 0, 0, 1],
                [1, 0, 0, 0, 1]
            ],
            S: [
                [0, 1, 1, 1, 0],
                [1, 0, 0, 0, 1],
                [1, 0, 0, 0, 0],
                [0, 1, 1, 1, 0],
                [0, 0, 0, 0, 1],
                [1, 0, 0, 0, 1],
                [0, 1, 1, 1, 0]
            ],
            P: [
                [1, 1, 1, 1, 0],
                [1, 0, 0, 0, 1],
                [1, 0, 0, 0, 1],
                [1, 1, 1, 1, 0],
                [1, 0, 0, 0, 0],
                [1, 0, 0, 0, 0],
                [1, 0, 0, 0, 0]
            ],
            I: [
                [1, 1, 1],
                [0, 1, 0],
                [0, 1, 0],
                [0, 1, 0],
                [0, 1, 0],
                [0, 1, 0],
                [1, 1, 1]
            ]
        };
    }

    // Get block colors for each letter to make them visually distinct
    static getLetterColors() {
        const colors = {
            B: 4,  // gold/ore
            L: 1,  // grass green
            O: 14, // blue glass/metal
            C: 18, // red car color
            K: 11, // crystal pink
            E: 10, // leaves green
            N: 6,  // sand
            S: 16, // window blue
            P: 7,  // snow white
            I: 15, // beige interior
            E2: 9   // wood brown (second E)
        };
        
        // Return a function that handles multiple instances of the same letter
        return (letter, index, text) => {
            // Special handling for the second E in BLOCKENSPIEL
            if (letter === 'E' && text.indexOf('E', index + 1) !== -1 && text.lastIndexOf('E') === index) {
                return colors.E2;
            }
            return colors[letter] || 12; // default tan
        };
    }

    // Generate credits with 100 realistic game development roles assigned to Joe, Manu, and Ev
    static generateCredits() {
        const roles = [
            // Programming (33 roles)
            'Lead Programmer', 'Senior Game Developer', 'Gameplay Programmer', 'Engine Programmer', 'Tools Programmer',
            'AI Programmer', 'Physics Programmer', 'Network Programmer', 'UI Programmer', 'Audio Programmer',
            'Graphics Programmer', 'System Architect', 'Technical Director', 'Lead Engineer', 'Backend Developer',
            'Frontend Developer', 'Full Stack Developer', 'DevOps Engineer', 'Platform Engineer', 'Mobile Developer',
            'Console Programmer', 'Performance Engineer', 'Security Engineer', 'Database Developer', 'Shader Programmer',
            'VR Developer', 'AR Developer', 'Machine Learning Engineer', 'Data Engineer', 'Cloud Developer',
            'Infrastructure Engineer', 'Build Engineer', 'Automation Engineer',

            // Art & Design (33 roles)
            'Art Director', 'Lead Artist', 'Concept Artist', 'Character Artist', '3D Modeler',
            'Environment Artist', 'Texture Artist', 'Lighting Artist', 'VFX Artist', 'Technical Artist',
            'Animation Director', 'Character Animator', 'Environmental Animator', 'UI/UX Designer', 'Level Designer',
            'Game Designer', 'Creative Director', 'Visual Designer', 'Icon Designer', 'Logo Designer',
            'Storyboard Artist', 'Cinematic Artist', 'Particle Effects Artist', 'Shader Artist', 'Material Artist',
            'Rigging Artist', 'Motion Graphics Artist', 'Brand Designer', 'Marketing Artist', 'Promotional Artist',
            'User Experience Designer', 'Interface Designer', 'Accessibility Designer',

            // Production & Other (34 roles)
            'Executive Producer', 'Producer', 'Associate Producer', 'Project Manager', 'Scrum Master',
            'Product Owner', 'Development Manager', 'Studio Head', 'Creative Producer', 'Technical Producer',
            'Audio Director', 'Sound Designer', 'Music Composer', 'Voice Director', 'Foley Artist',
            'Quality Assurance Lead', 'Senior QA Tester', 'QA Automation Engineer', 'Localization Manager', 'Translator',
            'Community Manager', 'Marketing Director', 'Brand Manager', 'Public Relations Manager', 'Content Creator',
            'Documentation Writer', 'Technical Writer', 'Legal Counsel', 'Business Development', 'Publisher Relations',
            'Platform Relations', 'Esports Coordinator', 'Analytics Specialist', 'User Research Lead'
        ];

        const developers = ['Joe', 'Manu', 'Ev'];
        const credits = {};
        
        // Initialize each developer with empty arrays
        developers.forEach(dev => credits[dev] = []);
        
        // Randomly assign roles ensuring roughly equal distribution
        const shuffledRoles = [...roles].sort(() => Math.random() - 0.5);
        shuffledRoles.forEach((role, index) => {
            const dev = developers[index % 3];
            credits[dev].push(role);
        });

        return credits;
    }
}