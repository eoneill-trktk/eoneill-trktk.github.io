if (window.location.pathname.includes('/join-us/')) {
    const leafletCss = document.createElement('link');
    leafletCss.rel = 'stylesheet';
    leafletCss.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(leafletCss);


    const slickCSS = document.createElement('link');
    slickCSS.rel = 'stylesheet';
    slickCSS.href = 'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css';
    document.head.appendChild(slickCSS);


    const styleTag = document.createElement('style');
    styleTag.textContent = `
        #map {
            width: 100%;
            height: 70vh; /* Reduced from 100vh */
        }
        .leaflet-popup-content {
            margin: 10px 15px;
            line-height: 1.4;
            width: 300px !important; /* Fixed width for better control */
            max-height: 400px; /* Prevent excessive height */
            overflow-y: auto; /* Add scroll if content is too long */
        }
        .location-popup {
            font-size: 14px;
        }
        .location-popup img {
            max-width: 100%;
            max-height: 120px;
            margin-bottom: 8px;
            display: block;
        }
        .location-popup h3 {
            margin: 5px 0;
            font-size: 16px;
            line-height: 1.3;
        }
        .location-popup p {
            margin: 6px 0;
            font-size: 13px;
            line-height: 1.4;
        }
        .location-popup .address {
            font-weight: bold;
            margin: 8px 0;
            font-size: 13px;
        }
        .location-popup .contact-info {
            margin-top: 10px;
            font-size: 13px;
        }
        .location-popup a {
            word-break: break-all; /* Prevent long URLs from breaking layout */
        }
        .locations-list {
            display: block;
            width: 100%;
        }
        .location {
            display: flex;
            margin-bottom: 2rem;
            width: 100%;
        }
        .location-image {
            flex: 0 0 auto;
            width: 150px;
            margin-right: 1rem;
        }
        .location-image img {
            width: 100%;
            height: auto;
            display: block;
        }
        .location-content {
            flex: 1;
        }
        .location-category {
            font-weight: bold;
            margin-bottom: 0.5rem;
        }
        .location-title {
            margin: 0 0 0.5rem 0;
            font-size: 1.25rem;
        }
        .location-description {
            margin-bottom: 1rem;
            line-height: 1.5;
        }
        .location-address {
            line-height: 1.5;
        }
        .location-address div {
            margin-bottom: 0.25rem;
        }
        /* Custom scrollbar for popup */
        .leaflet-popup-content::-webkit-scrollbar {
            width: 6px;
        }
        .leaflet-popup-content::-webkit-scrollbar-track {
            background: #f1f1f1;
        }
        .leaflet-popup-content::-webkit-scrollbar-thumb {
            background: #888;
        }
    `;
    document.head.appendChild(styleTag);

    
    const leafletJs = document.createElement('script');
    leafletJs.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    leafletJs.onload = function() {
    
        const map = L.map('map').setView([42.4072, -71.3824], 8);

    
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

    
        const locations = [
            {
                name: "ABS Behavioral Health Services",
                image: "https://workwithoutlimits.org/wp-content/uploads/2020/11/ABS_logo.jpg",
                category: "Human Service Agencies",
                description: "ABS Behavioral Health Services has two office locations (Worcester and Framingham), and we serve a 25 mile radius in these areas. ABS Behavioral Health Services provides provides high-quality ABA services and individualized vocational programs for children, adolescents, and adults diagnosed with Autism Spectrum Disorder. Through individualized programming we teach behavioral techniques that increase appropriate social behaviors, maximize independence, and decrease maladaptive behaviors. Our comprehensive programs are grounded in Applied Behavior Analysis (ABA). Our highly qualified, experienced staff utilize the principles of ABA to teach and promote generalization of skills across environments including Home, School and Community Settings as well as Social Skills Groups. We, at ABS Behavioral Health Services, LLC look forward to working together with your family.",
                website: "https://www.absbehavioralhealthservices.com/",
                address: "1 Ararat St, Worcester, MA 01606, USA",
                contact: "Alyson Burchill, Owner/Operator",
                email: "absbehavioralhealth@gmail.com",
                phone: "508-341-2829",
                lat: 42.2626,
                lng: -71.8023
            },
            {
                name: "Accept Education Collaborative",
                image: "https://workwithoutlimits.org/wp-content/uploads/2020/12/ACCEPT_logo_.png",
                category: "Youth and Young Adults",
                description: "At ACCEPT's Center for Learning and Growth, the transition programs prepare students for a successful passage to adult living. We view each student as the unique individual they are and, using their IEP and results from transition and vocational assessments, develop a personalized transition plan to maximize independence, vocational potential, participation in the community and help students meet their postsecondary vision. At the heart of our transition programs is an integrated team model that seamlessly blends functional academics, community experiences, social skills development, specialized services, vocational training, and independent living skills. The programs take full advantage of current research showing that weaving these varied supports throughout the day results in greater generalization and therefore more independence and better outcomes for students. We believe that every day should be an opportunity for students to develop self-confidence, self-awareness, and the life skills to pursue their passions.",
                address: "4 Tech Circle, Natick, MA 01760",
                contact: "Becki Lauzon, Transition Program Coordinator",
                email: "rlauzon@accept.org",
                phone: "508-653-6776",
                lat: 42.2870,
                lng: -71.3641
            },
            {
                name: "AdLib",
                image: "https://workwithoutlimits.org/wp-content/uploads/2025/01/AdLib-Logo.png",
                category: "Human Service Agencies",
                description: "AdLib is a cross-disability organization that serves people with disabilities of all ages. Our core-services include information and referral (available to anyone), skills training- including learning about benefits, peer support, advocacy (individual and systemic), and transition (from youth to adulthood and facilities to community). In addition, we have the Personal Care Attendant program that allows people with physical disabilities to hire their own PCAs; options counseling, which supports people in navigating insurance and living options; representative payee program which manages funds for social security recipients; and transportation program. All our services aim to allow people with disabilities to maintain an active community life.",
                address: "215 North Street, Pittsfield, MA 01201",
                contact: "Samantha Bertolino, VR IL Coordinator",
                email: "sbertolino@adlibcil.org",
                phone: "413-442-7047 ext. 37",
                lat: 42.4485,
                lng: -73.2545
            },
            {
                name: "Advocates",
                image: "https://workwithoutlimits.org/wp-content/uploads/2025/04/Advocates-Logo-Color-scaled.jpg",
                category: "Human Service Agencies",
                description: "Advocates is a nonprofit organization providing comprehensive services for people facing developmental, mental health, or other life challenges. Our approach is intentional and person-centered. First, we listen. Then, we partner with individuals and families to shape creative solutions that honor their needs and goals. With our support, thousands of people lead rewarding lives as engaged members of their communities.",
                address: "8 Forge Parkway, Franklin, MA",
                contact: "Jacqueline Vaillancourt, Vice President, Employment Services",
                email: "jvaillancourt@advocatesinc.org",
                phone: "508-298-1160",
                lat: 42.0934,
                lng: -71.4057
            },
            {
                name: "American Training",
                image: "https://workwithoutlimits.org/wp-content/uploads/2024/09/American-Training.png",
                category: "Human Service Agencies",
                description: "American Training Inc provides services in three locations: Andover, Wakefield, and Lowell. American Training Inc premiers, uniquely-developed programs providing dramatic results to people from all walks of life. Award-winning workforce development, day habilitation, education, and specialized housing plans help those who are unemployed, under-employed, at risk, people with disabilities, as well as those with limited marketable or language skills. American Training's passion is evident in our commitment to bringing out the best in everyone we touch. We promise to make Every Life Matter.",
                address: "Andover, MA 01810, USA",
                contact: "Krista Cronin, Job Developer",
                email: "kristacronin@americantraininginc.com",
                phone: "978-564-5498",
                lat: 42.6583,
                lng: -71.1367
            },
            {
                name: "And Still We Rise",
                image: "https://workwithoutlimits.org/wp-content/uploads/2021/07/And-We-Still-Rise.png",
                category: "Human Service Agencies",
                description: "And Still We Rise specializes in the mental health care of women, BIPoC, queer and trans communities. Our providers are culturally diverse and bring real-life experience to the work. We value community, critical consciousness, and decolonizing mental healthcare.",
                address: "800 Boylston Street, Boston, MA 02199, United States",
                contact: "Roberta Holmes, Executive Assistant",
                email: "info@andstillwerise.us",
                phone: "888-572-0795",
                lat: 42.3489,
                lng: -71.0823
            },
            {
                name: "Aspire Living & Learning",
                image: "https://workwithoutlimits.org/wp-content/uploads/2024/04/Aspire-Living-and-Learning.png",
                category: "Human Service Agencies",
                description: "At Aspire Living & Learning, amazing things happen every day. Relationships are formed. Lives are transformed. Through connection and self-discovery, people of all abilities are unlocking potential and thriving. Through a wide range of meaningful activities, Aspire works with people to pursue their passions, make choices about their development, explore their community, and build connection. We offer supported employment, community engagement activities, and so much more to empower neurodiverse adults to live more fully and more independently in their communities.",
                address: "80 Erdman Way suite 103a, Leominster, MA 01453",
                contact: "Bradford Battersby",
                email: "bbattersby@allinc.org",
                phone: "978-868-8527",
                lat: 42.5259,
                lng: -71.7597
            },
            {
                name: "Association for Autism and Neurodiversity (AANE)",
                image: "https://workwithoutlimits.org/wp-content/uploads/2023/12/AANE-Square-Logo-Rectangle.png",
                category: "Human Service Agencies",
                description: "From the beginning, AANE has strived to be an inclusive organization. Autistic and similarly Neurodivergent adults have long been members of our staff and governance. As our community has expanded and become more diverse, we have transformed our programs and resources to meet new needs—and we've worked to thoughtfully update our language along the way.",
                address: "85 Main Street suite 3, Watertown, MA 02472",
                contact: "Nataliya Poto, Director of Asperger/Autism Professional Coaching Association AAPCA/Director of LifeMAP Programs",
                email: "nataliya.poto@aane.org",
                phone: "617-393-3824 X219",
                lat: 42.3676,
                lng: -71.1826
            },
            {
                name: "Assumption University Career Development & Internship Center (CDIC)",
                image: "https://workwithoutlimits.org/wp-content/uploads/2021/05/Assumption-University-Seal-1.jpg",
                category: "Colleges and Universities",
                description: "The Assumption University Career Development & Internship Center (CDIC) is dedicated to helping undergraduate students map out their future from the day they arrive at Assumption through graduation. Experienced, full-time staff members provide guidance, resources, and support as students explore academic and career options, set goals, and work and maintains relationships with employers to connect students to internship and full-time job opportunities.",
                address: "500 Salisbury Street, Worcester, MA 01609",
                contact: "Shannon Curtis, Senior Director for Career and Student Success Strategies",
                email: "Sj.curtis@assumption.edu",
                phone: "508-767-7248",
                lat: 42.2875,
                lng: -71.8094
            },
            {
                name: "Attainable: The Massachusetts ABLE Savings Plan",
                image: "https://workwithoutlimits.org/wp-content/uploads/2020/12/attainable_logo.jpg",
                category: "Human Service Agencies",
                description: "Have you heard about tax-advantaged ABLE accounts? The Attainable Savings Plan offered by MEFA and managed by Fidelity Investments offers individuals with disabilities the opportunity to invest in tax-advantaged savings accounts for short and long-term disability-related expenses while keeping benefits such as Social Security and Medicaid. MEFA serves as the state sponsor of Attainable which provides eligible individuals with a new way of saving for current and long term expenses. If you know of an individual or family who would benefit from Attainable, they can find more information here.",
                website: "https://www.mefa.org/save/attainable-savings-plan",
                address: "60 State Street, Boston, MA 02109",
                contact: "Mary Rubenis, Attainable Outreach Manager",
                email: "MRubenis@mefa.org",
                phone: "617-224-4843",
                lat: 42.3587,
                lng: -71.0567
            },
            {
                name: "BAMSI",
                image: "https://workwithoutlimits.org/wp-content/uploads/2020/12/BAMSI-logo-1.jpg",
                category: "Human Service Agencies",
                description: "Incorporated in 1975 and governed by a majority-minority board of directors, BAMSI (Brockton Area Multi-Services, Inc.), provides a broad spectrum of high-quality human services to individuals and families, including day, residential, and family support; brain injury services, HIV/AIDS programs; services for low-income and and/or infirm seniors; behavioral health services for individuals and families, and a wide array of wraparound programs for children, youth, and families.",
                address: "10 Christy's Drive, Brockton, MA 02301",
                contact: "Wanda Duarte, Associate Executive Assistant",
                email: "wduarte@bamsi.org",
                lat: 42.0719,
                lng: -71.0389
            },
            {
                name: "Bay Cove Human Services",
                image: "https://workwithoutlimits.org/wp-content/uploads/2020/12/Bay-Cove-logo.png",
                category: "Human Service Agencies",
                description: "Bay Cove Human Services partners with people to overcome challenges and realize personal potential. We believe that everyone has value. We especially welcome those individuals other organizations are unable to help - persons with multiple diagnoses, a history of treatment failures and a total inability to pay for services. Our services are outcome-focused, individualized and designed to build on the strengths of the whole person.",
                address: "66 Canal Street, Boston, MA 02114",
                lat: 42.3649,
                lng: -71.0519
            },
            {
                name: "Beaverbrook Step, Inc., Options Day Services",
                image: "https://workwithoutlimits.org/wp-content/uploads/2023/05/Beaverbrook-STEP-small-1.jpg",
                category: "Human Service Agencies",
                description: "Community Based Day/Work Programs that service adults with intellectual and development disabilities. Consisting of four Day Programs; Options Alternative (Watertown), Options Community (Belmont), Options Employment (Belmont), and Options Unlimited (Belmont).",
                address: "85 Main Street, Watertown, MA 02472",
                contact: "Beverly Demby Tucker, Employment Specialist",
                email: "bdembytucker@beaverbrookstep.org",
                phone: "(857) 212-6709",
                lat: 42.3676,
                lng: -71.1826
            },
            {
                name: "Behavioral Healthcare Developmental Disabilities & Hospitals (BHDDH)",
                image: "https://workwithoutlimits.org/wp-content/uploads/2021/04/BHDDH-New-Logo.jpg",
                category: "Massachusetts and RI State Agencies",
                description: "People with intellectual and developmental disabilities can and should be employed in the community alongside people without disabilities and earn competitive wages. As an Employment First State there is a strong commitment to ensuring everyone is supported to make informed choices about their work and careers and have the resources to seek, obtain, and be successful in community employment. The Division of Developmental Disabilities is responsible for planning, funding and overseeing a community system of services and supports for adults with developmental disabilities. We believe that all Rhode Islanders deserve to live happy, healthy and fulfilling lives. Our work supports efforts across the state to expand opportunity and provide high-quality services for all Rhode Islanders.",
                address: "6 Harrington Rd, Cranston, RI 02920",
                contact: "Gerard MacKay, Associate Administrator, Employment",
                email: "gerard.mackay@bhddh.ri.gov",
                phone: "401-462-5279",
                lat: 41.7787,
                lng: -71.4373
            },
            {
                name: "Berkshire Community College Career Development",
                image: "https://workwithoutlimits.org/wp-content/uploads/2020/11/bershirecc-logo.jpg",
                category: "Colleges and Universities",
                description: "The Career Development Center is committed to empowering individuals by enabling an atmosphere that nurtures self-exploration and student success through informed career-related choices. Through cooperative community engagement, and by taking an energetic role in the career planning process; we seek to inspire students – past, present, and future.",
                address: "1350 West Street, Pittsfield, MA 01201",
                contact: "Sarah Offenbach, Interim Coordinator, Office of Career Development",
                email: "soffenbach@berkshirecc.edu",
                phone: "413-236-1637",
                lat: 42.4485,
                lng: -73.2545
            },
            {
                name: "Best Buddies",
                image: "https://workwithoutlimits.org/wp-content/uploads/2020/12/Best-Buddies-Logo-Color-CMYK-CVC-for-work-without-limits.jpg",
                category: "Human Service Agencies",
                description: "Best Buddies International is a nonprofit 501(c)(3) organization dedicated to establishing a global volunteer movement that creates opportunities for one-to-one friendships, integrated employment and leadership development for people with intellectual and developmental disabilities (IDD). Best Buddies, Integrated Employment Jobs program secures jobs for people with intellectual and developmental disabilities (DD), allowing them to earn an income , pay taxes, and continuously and independently support themselves.",
                address: "529 Main Street, Suite 202, Boston, Massachusetts",
                contact: "Rebekah McPheeters-Brown, Director",
                email: "RebekahMcPheeters@BestBuddies.org",
                phone: "617.778.0522",
                lat: 42.3611,
                lng: -71.0571
            },
            {
                name: "Bose",
                image: "https://workwithoutlimits.org/wp-content/uploads/2023/04/Large-JPG-Bose-logo_BIMI-2.jpg",
                category: "Business Network",
                description: "At Bose, we focus on creating an environment where employees can experience a collective sense of belonging and – in parallel – feel valued for their individual attributes. Creating a culture of inclusion is a deliberate process. It means adapting to the changing needs of diverse talent, clients, and markets to create an environment that welcomes differing opinions on how to solve problems and innovate. These differences extend well beyond gender and race - they include cultural, ability, economic, gender identity/expression and age differences, among many others. In an increasingly competitive global market, inclusivity is now, more than ever, critical to success.",
                address: "100 The Mountain Rd, Framingham, MA 01701, USA",
                lat: 42.2796,
                lng: -71.4163
            },
            {
                name: "Boston Children's Hospital",
                image: "https://workwithoutlimits.org/wp-content/uploads/2020/11/BCHlogomotto_primary_72dpi.jpg",
                category: "Business Network",
                description: "No matter your background, experience or passions, Boston Children's Hospital values what you bring to every task at hand. Here, you'll find a range of opportunities that will help you realize your goals - both in and out of the workplace. We're deeply committed to creating a best-in-class work environment at all levels that includes the opportunity to develop your skills, advance your career and enjoy the resources and freedom you need. Explore our opportunities and learn more about our collaborative culture and world-class hospital. At Boston Children's Hospital, great things happen everywhere you look. Make our next success story your own.",
                address: "300 Longwood Avenue, Boston, MA",
                lat: 42.3366,
                lng: -71.1042
            },
            {
                name: "Boston College Career Center",
                image: "https://workwithoutlimits.org/wp-content/uploads/2020/11/BC-logo.png",
                category: "Colleges and Universities",
                description: "The Boston College Career Center empowers students to reflect on their talents and experiences, explore their career objectives and achieve their career goals. By working directly with students and collaborating with a broad array of partners, communities and networks, our team facilitates programs, activities and services that enable students to take ownership of their career decisions and lead meaningful professional lives. The Boston College Career Center is a centralized office serving students in the Morrissey College of Arts and Sciences, Carroll School of Management, Connell School of Nursing, Lynch School of Education, School of Theology and Ministry and Woods College of Advancing Studies.",
                address: "38 Commonwealth Avenue, Chestnut Hill, MA 02467",
                contact: "Peter Hunt, Assistant Director, Career Exploration, Career Center",
                email: "peter.hunt@bc.edu",
                phone: "617-552-3430",
                lat: 42.3355,
                lng: -71.1685
            },
            {
                name: "Boston Medical Center",
                image: "https://workwithoutlimits.org/wp-content/uploads/2023/12/Boston-Medical-Center.jpg",
                category: "Human Service Agencies",
                description: "The BMC Department of Psychiatry provides behavioral health services along the continuum of care from inpatient care at BMC Brockton Behavioral Health Center, consultation and liaison, to emergency services, urgent care, outpatient services and psychiatric services embedded within primary care settings. Our faculty, clinicians and staff are deeply committed to providing excellent care to the diverse populations served by Boston Medical Center, VA Boston Healthcare System, and our community health center partners. We serve patients with all diagnoses including those dually diagnosed with substance use and mental health disorders. We leverage telehealth technology to broaden equitable access for patients. We embed trauma-informed care into our clinical practice and we provide care that is responsive and tailored to the needs of the many patients who receive care at our institution. The Department of Psychiatry also includes the Metro Boston Recovery Learning Community and the Southeast Recovery Learning Community. These programs provide peer-to-peer services for people in recovery from mental health and/or substance use issues, through the utilization of peer support, advocacy, education, career coaching and job readiness in a trauma-sensitive and person-centered manner.",
                address: "85 East Newton Street, Boston, MA 02118",
                contact: "Marion E. Burke RN, MSN Director Quality Management, Risk Management and Training",
                email: "marion.burke@bmc.org",
                phone: "617-638-8013",
                lat: 42.3361,
                lng: -71.0729
            },
            {
                name: "Boston Mutual",
                image: "https://workwithoutlimits.org/wp-content/uploads/2023/08/BML-logo.jpg",
                category: "Business Network",
                description: "All of us at Boston Mutual have the shared goal of an inclusive workplace that capitalizes on our individual and collective talents, skills and strengths. Together, we are committed to creating a professional working environment which is welcoming and respectful of individual differences. Our focus is a workplace that is supportive of inclusion, which is the primary dynamic that creates a diverse, engaged culture at Boston Mutual.",
                address: "120 Royall Street, Canton, MA 02021, USA",
                lat: 42.1584,
                lng: -71.1448
            },
            {
                name: "Boston University Center for Psychiatric Rehabilitation",
                image: "https://workwithoutlimits.org/wp-content/uploads/2020/12/CPR-Logo-Updated.png",
                category: "Human Service Agencies",
                description: "The Boston University Center for Psychiatric Rehabilitation is a research, training, and service organization dedicated to improving the lives of persons who have psychiatric disabilities. Their work is guided by the most basic of rehabilitation values, that first and foremost, persons with psychiatric disabilities have the same goals and dreams as any other person. The Center's mission is to increase the likelihood that they can achieve these goals by improving the effectiveness of people, programs, and service systems using strategies based on the core values of recovery and rehabilitation.",
                address: "940 Commonwealth Avenue, Boston, MA, USA",
                contact: "Dori Hutchinson, Executive Director",
                email: "dorih@bu.edu",
                phone: "617-353-3549",
                lat: 42.3505,
                lng: -71.1055
            },
            {
                name: "Brandeis Graduate School of Arts and Sciences",
                image: "https://workwithoutlimits.org/wp-content/uploads/2020/11/brandeis-gsas-logo.png",
                category: "Colleges and Universities",
                description: "The Center for Career & Professional Development of the Brandeis Graduate School of Arts and Sciences (GSAS) seeks to educate, empower and support GSAS students and alumni in gaining insight into their unique career and life aspirations as they pursue meaningful work in a global, diverse, and ever-changing workplace. The Graduate School of Arts and Sciences at Brandeis University is a center for pioneering investigation embedded in the cooperative environment of a student-centered, medium-size research university. We are driven by academic excellence, reverence for learning, and inclusivity — values of the Jewish tradition. The smaller size of our doctoral, master's and postbaccalaureate programs enables scholars to build close relationships with our world-class faculty and conduct interdisciplinary research across traditional academic boundaries.",
                address: "415 South Street, Waltham, MA 02453",
                contact: "Sue Levine, Associate Director, Center for Career Development",
                email: "smlevine@brandeis.edu",
                phone: "781-736-3414",
                lat: 42.3656,
                lng: -71.2589
            },
            {
                name: "Bridgewater State University Career Services Office",
                image: "https://workwithoutlimits.org/wp-content/uploads/2020/11/BSU-logo.gif",
                category: "Colleges and Universities",
                description: "The Bridgewater State University Career Services Office assist a diverse student body in the process of developing, evaluating and initiating their career plans. Our primary focus is on the undergraduate student experience. Services are also provided to students with disabilities, international students, LGBT students, graduate students, alumni and Veterans. Career Services at BSU intentionally provides all students with opportunities to learn and practice specific skills essential for their transition from student to professional.",
                address: "19 Park Avenue, Bridgewater, MA",
                contact: "John Paganelli, Jr., Director/Career Services",
                email: "jpaganelli@bridgew.edu",
                phone: "508-531-1328",
                lat: 41.9884,
                lng: -70.9685
            }
        ];

        locations.forEach(location => {
            let popupContent = `<div class="location-popup">`;
            
            if (location.image) {
                popupContent += `<img src="${location.image}" alt="${location.name}">`;
            }
            
            popupContent += `<h3>${location.name}</h3>`;
            
            if (location.category) {
                popupContent += `<p><strong>Category:</strong> ${location.category}</p>`;
            }
            
            
            const maxDescLength = 200;
            const description = location.description.length > maxDescLength 
                ? location.description.substring(0, maxDescLength) + '...' 
                : location.description;
            popupContent += `<p>${description}</p>`;
            
            if (location.website) {
                popupContent += `<p><a href="${location.website}" target="_blank">Visit our website</a></p>`;
            }
            
            popupContent += `<p class="address"><strong>Address:</strong> ${location.address}</p>`;
            
            if (location.contact || location.email || location.phone) {
                popupContent += `<div class="contact-info">`;
                if (location.contact) {
                    popupContent += `<p><strong>Contact:</strong> ${location.contact}</p>`;
                }
                if (location.email) {
                    popupContent += `<p><strong>Email:</strong> <a href="mailto:${location.email}">${location.email}</a></p>`;
                }
                if (location.phone) {
                    popupContent += `<p><strong>Phone:</strong> ${location.phone}</p>`;
                }
                popupContent += `</div>`;
            }
            
            popupContent += `</div>`;
            
            const marker = L.marker([location.lat, location.lng]).addTo(map);
            marker.bindPopup(popupContent);
        });
    };
    document.head.appendChild(leafletJs);
}