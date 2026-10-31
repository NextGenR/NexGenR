-- ==============================================================================
-- All-In-One Setup & Seed: RRB Full Mock Test 1 for Supabase (TCS iON CBT)
-- ==============================================================================
-- Automatically ensures required tables and columns exist and seeds all 100 questions
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Table: mock_tests
CREATE TABLE IF NOT EXISTS public.mock_tests (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    total_questions INTEGER NOT NULL DEFAULT 100,
    total_time_minutes INTEGER NOT NULL DEFAULT 90,
    sectional_time_minutes INTEGER NOT NULL DEFAULT 23,
    has_sectional_timing BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Create Table: questions
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id VARCHAR(100) NOT NULL REFERENCES public.mock_tests(id) ON DELETE CASCADE,
    question_number INTEGER NOT NULL,
    part_number INTEGER NOT NULL DEFAULT 1,
    section_name VARCHAR(100) NOT NULL,
    section_title VARCHAR(150) NOT NULL,
    chapter_name VARCHAR(150),
    difficulty VARCHAR(50) DEFAULT 'Moderate',
    question_text TEXT NOT NULL,
    question_text_hi TEXT,
    options JSONB NOT NULL,
    options_hi JSONB,
    correct_option VARCHAR(10) NOT NULL,
    solution_text TEXT,
    solution_text_hi TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE (test_id, question_number)
);

-- 4. Create Table: test_attempts
CREATE TABLE IF NOT EXISTS public.test_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    roll_number VARCHAR(50) NOT NULL DEFAULT 'ANONYMOUS',
    candidate_name VARCHAR(150) DEFAULT 'ANKIT SHARMA',
    candidate_email VARCHAR(255),
    test_id VARCHAR(100) NOT NULL DEFAULT 'rrb_cbt_mock_1',
    test_title VARCHAR(255) NOT NULL DEFAULT 'RRB Full Mock Test 1 (TCS iON CBT Pattern)',
    status VARCHAR(30) NOT NULL DEFAULT 'in_progress',
    current_section_id VARCHAR(50) NOT NULL DEFAULT 'gs',
    current_question_number INTEGER NOT NULL DEFAULT 1,
    sectional_time_left JSONB NOT NULL DEFAULT '{"gs": 1350, "math": 1350, "gi": 1350, "ga": 1350}'::jsonb,
    completed_sections JSONB NOT NULL DEFAULT '[]'::jsonb,
    question_states JSONB NOT NULL DEFAULT '{}'::jsonb,
    total_questions INTEGER NOT NULL DEFAULT 100,
    total_attempted INTEGER NOT NULL DEFAULT 0,
    total_correct INTEGER NOT NULL DEFAULT 0,
    total_incorrect INTEGER NOT NULL DEFAULT 0,
    total_unattempted INTEGER NOT NULL DEFAULT 100,
    total_score NUMERIC(6, 2) NOT NULL DEFAULT 0.00,
    accuracy_percentage NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    section_breakdown JSONB DEFAULT '[]'::jsonb,
    time_taken_seconds INTEGER NOT NULL DEFAULT 0,
    started_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    submitted_at TIMESTAMPTZ,
    last_synced_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    client_ip TEXT,
    user_agent TEXT
);

-- Ensure columns exist
ALTER TABLE public.test_attempts ADD COLUMN IF NOT EXISTS status VARCHAR(30) DEFAULT 'in_progress';
ALTER TABLE public.test_attempts ADD COLUMN IF NOT EXISTS current_section_id VARCHAR(50) DEFAULT 'gs';
ALTER TABLE public.test_attempts ADD COLUMN IF NOT EXISTS current_question_number INTEGER DEFAULT 1;
ALTER TABLE public.test_attempts ADD COLUMN IF NOT EXISTS sectional_time_left JSONB DEFAULT '{"gs": 1350, "math": 1350, "gi": 1350, "ga": 1350}'::jsonb;
ALTER TABLE public.test_attempts ADD COLUMN IF NOT EXISTS completed_sections JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.test_attempts ADD COLUMN IF NOT EXISTS question_states JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.test_attempts ADD COLUMN IF NOT EXISTS last_synced_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());

-- 5. Create Table: test_attempt_answers
CREATE TABLE IF NOT EXISTS public.test_attempt_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID NOT NULL REFERENCES public.test_attempts(id) ON DELETE CASCADE,
    question_number INTEGER NOT NULL,
    section_name VARCHAR(100) NOT NULL,
    selected_option VARCHAR(10),
    correct_option VARCHAR(10) NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    marks_awarded NUMERIC(4, 2) DEFAULT 0.00,
    status VARCHAR(30) NOT NULL,
    time_spent_seconds INTEGER NOT NULL DEFAULT 0,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE (attempt_id, question_number)
);

ALTER TABLE public.test_attempt_answers ADD COLUMN IF NOT EXISTS time_spent_seconds INTEGER DEFAULT 0;

-- 6. Create Table: user_responses (Per-question option and timestamp sync)
CREATE TABLE IF NOT EXISTS public.user_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id TEXT NOT NULL,
    roll_number VARCHAR(50) NOT NULL DEFAULT '2201048291',
    candidate_name VARCHAR(150) DEFAULT 'ANKIT SHARMA',
    test_id VARCHAR(100) NOT NULL DEFAULT 'rrb_cbt_mock_1',
    question_number INTEGER NOT NULL,
    section_name VARCHAR(100) NOT NULL,
    selected_option VARCHAR(10),
    time_taken_seconds INTEGER NOT NULL DEFAULT 0,
    correct_option VARCHAR(10),
    is_correct BOOLEAN DEFAULT FALSE,
    status VARCHAR(30) NOT NULL DEFAULT 'ANSWERED',
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE (attempt_id, question_number)
);

-- 7. Enable Row Level Security (RLS)
ALTER TABLE public.mock_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_attempt_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_responses ENABLE ROW LEVEL SECURITY;

-- 8. Configure RLS Policies
DROP POLICY IF EXISTS "Allow public read of mock tests" ON public.mock_tests;
CREATE POLICY "Allow public read of mock tests" ON public.mock_tests FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Allow public insert of mock tests" ON public.mock_tests;
CREATE POLICY "Allow public insert of mock tests" ON public.mock_tests FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update of mock tests" ON public.mock_tests;
CREATE POLICY "Allow public update of mock tests" ON public.mock_tests FOR UPDATE TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read of questions" ON public.questions;
CREATE POLICY "Allow public read of questions" ON public.questions FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Allow public insert of questions" ON public.questions;
CREATE POLICY "Allow public insert of questions" ON public.questions FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update of questions" ON public.questions;
CREATE POLICY "Allow public update of questions" ON public.questions FOR UPDATE TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public insert of test attempts" ON public.test_attempts;
CREATE POLICY "Allow public insert of test attempts" ON public.test_attempts FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read of test attempts" ON public.test_attempts;
CREATE POLICY "Allow public read of test attempts" ON public.test_attempts FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Allow public update of test attempts" ON public.test_attempts;
CREATE POLICY "Allow public update of test attempts" ON public.test_attempts FOR UPDATE TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public insert of answers" ON public.test_attempt_answers;
CREATE POLICY "Allow public insert of answers" ON public.test_attempt_answers FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read of answers" ON public.test_attempt_answers;
CREATE POLICY "Allow public read of answers" ON public.test_attempt_answers FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Allow public update of answers" ON public.test_attempt_answers;
CREATE POLICY "Allow public update of answers" ON public.test_attempt_answers FOR UPDATE TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public insert of user_responses" ON public.user_responses;
CREATE POLICY "Allow public insert of user_responses" ON public.user_responses FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read of user_responses" ON public.user_responses;
CREATE POLICY "Allow public read of user_responses" ON public.user_responses FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Allow public update of user_responses" ON public.user_responses;
CREATE POLICY "Allow public update of user_responses" ON public.user_responses FOR UPDATE TO public USING (true) WITH CHECK (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_test_attempts_status_user ON public.test_attempts (status, roll_number);
CREATE INDEX IF NOT EXISTS idx_test_attempts_test_id ON public.test_attempts (test_id, status);
CREATE INDEX IF NOT EXISTS idx_test_attempt_answers_attempt_q ON public.test_attempt_answers (attempt_id, question_number);
CREATE INDEX IF NOT EXISTS idx_questions_test_qnum ON public.questions (test_id, question_number);

-- ==============================================================================
-- 9. Seed Mock Test Record: RRB Mock Test 1
-- ==============================================================================
INSERT INTO public.mock_tests (id, title, total_questions, total_time_minutes, sectional_time_minutes, has_sectional_timing)
VALUES ('rrb_cbt_mock_1', 'RRB Full Mock Test 1 (TCS iON CBT Pattern)', 100, 90, 23, TRUE)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  total_questions = EXCLUDED.total_questions,
  total_time_minutes = EXCLUDED.total_time_minutes,
  sectional_time_minutes = EXCLUDED.sectional_time_minutes,
  has_sectional_timing = EXCLUDED.has_sectional_timing;

-- Clear previous questions for this test to allow clean re-seeding
DELETE FROM public.questions WHERE test_id = 'rrb_cbt_mock_1';

-- ==============================================================================
-- 10. Insert All 100 Questions for RRB Mock Test 1
-- ==============================================================================
INSERT INTO public.questions (
  test_id, question_number, part_number, section_name, section_title, 
  chapter_name, difficulty, question_text, question_text_hi, 
  options, options_hi, correct_option, solution_text, solution_text_hi
) VALUES
  ('rrb_cbt_mock_1', 1, 1, 'PART-1', 'General Science', '', 'Moderate', 'What is the acceleration due to gravity (g) at the center of the Earth?', 'पृथ्वी के केंद्र पर गुरुत्वीय त्वरण (g) का मान क्या होता है?', '{"a":"9.8 m/s²","b":"Zero (0)","c":"Infinite","d":"4.9 m/s²"}'::jsonb, '{"a":"9.8 मी/से²","b":"शून्य (0)","c":"अनंत","d":"4.9 मी/से²"}'::jsonb, 'b', 'At the Earth''s center, depth $d = R$. Formula: $g'' = g(1 - d/R) = g(1 - 1) = 0$. Hence weight of an object at the center is zero.', 'पृथ्वी के केंद्र पर गुरुत्वीय त्वरण का मान शून्य (0) होता है ($g'' = g(1 - d/R)$)। अतः केंद्र पर वस्तु का भार शून्य होता है।'),
  ('rrb_cbt_mock_1', 2, 1, 'PART-1', 'General Science', '', 'Moderate', 'A ball of mass $m$ is dropped from a height $h$ to the ground. Just before touching the ground, its potential energy is completely converted into:', '$m$ द्रव्यमान की एक गेंद को $h$ ऊँचाई से गिराया जाता है। जमीन से टकराने से ठीक पहले इसकी स्थितिज ऊर्जा पूरी तरह किसमें परिवर्तित हो जाती है?', '{"a":"Heat energy only","b":"Kinetic energy ($\\frac{1}{2}mv^2 = mgh$)","c":"Chemical energy","d":"Nuclear energy"}'::jsonb, '{"a":"केवल ऊष्मा ऊर्जा","b":"गतिज ऊर्जा ($\\frac{1}{2}mv^2 = mgh$)","c":"रासायनिक ऊर्जा","d":"नाभिकीय ऊर्जा"}'::jsonb, 'b', 'By the law of conservation of mechanical energy ($PE + KE = \text{constant}$), the initial potential energy ($mgh$) transforms fully into kinetic energy ($\frac{1}{2}mv^2$). Velocity $v = \sqrt{2gh}$.', 'यांत्रिक ऊर्जा संरक्षण के नियम के अनुसार उच्चतम बिंदु पर स्थित स्थितिज ऊर्जा ($mgh$) नीचे आते ही गतिज ऊर्जा ($\frac{1}{2}mv^2$) में बदल जाती है।'),
  ('rrb_cbt_mock_1', 3, 1, 'PART-1', 'General Science', '', 'Moderate', 'What is the acceleration of a freely falling body near the surface of the Earth?', 'पृथ्वी की सतह के निकट स्वतंत्र रूप से गिरती हुई वस्तु का त्वरण क्या होता है?', '{"a":"Zero","b":"9.8 m/s² (Constant)","c":"Increases with object mass","d":"Decreases with time"}'::jsonb, '{"a":"शून्य","b":"9.8 मी/से² (स्थिर)","c":"द्रव्यमान के साथ बढ़ता है","d":"समय के साथ घटता है"}'::jsonb, 'b', 'In a vacuum, all bodies regardless of mass fall with identical gravitational acceleration $g = 9.8\text{ m/s}^2$ ($g = GM/R^2$, independent of mass $m$).', 'स्वतंत्र रूप से गिरती वस्तु का गुरुत्वीय त्वरण वस्तु के द्रव्यमान पर निर्भर नहीं करता और पृथ्वी की सतह पर इसका मान लगभग 9.8 मी/से² होता है।'),
  ('rrb_cbt_mock_1', 4, 1, 'PART-1', 'General Science', '', 'Moderate', 'During photosynthesis in green plants, the oxygen gas released originates from:', 'हरे पौधों में प्रकाश संश्लेषण के दौरान निकलने वाली ऑक्सीजन गैस का स्रोत क्या है?', '{"a":"Carbon dioxide (CO₂)","b":"Water (H₂O)","c":"Glucose","d":"Chlorophyll"}'::jsonb, '{"a":"कार्बन डाइऑक्साइड (CO₂)","b":"जल (H₂O)","c":"ग्लूकोज","d":"क्लोरोफिल"}'::jsonb, 'b', 'Photolysis of water ($2\text{H}_2\text{O} \rightarrow 4\text{H}^+ + \text{O}_2 + 4e^-$) during the light-dependent reactions is the source of released oxygen.', 'प्रकाश संश्लेषण की प्रकाश अभिक्रिया में जल के प्रकाश-अपघटन (Photolysis of Water) से ऑक्सीजन गैस मुक्त होती है।'),
  ('rrb_cbt_mock_1', 5, 1, 'PART-1', 'General Science', '', 'Moderate', 'Which mild base is commonly used in antacid syrups to neutralize excessive gastric acid (HCl) in the stomach?', 'पेट की अत्यधिक अम्लता (HCl) को बेअसर करने के लिए एंटासिड सिरप में आमतौर पर किस हल्के क्षार का उपयोग किया जाता है?', '{"a":"Sodium Hydroxide","b":"Magnesium Hydroxide [Milk of Magnesia]","c":"Potassium Hydroxide","d":"Copper Sulphate"}'::jsonb, '{"a":"सोडियम हाइड्रॉक्साइड","b":"मैग्नीशियम हाइड्रॉक्साइड [मिल्क ऑफ मैग्नीशिया]","c":"पोटेशियम हाइड्रॉक्साइड","d":"कॉपर सल्फेट"}'::jsonb, 'b', 'Magnesium Hydroxide, $\text{Mg(OH)}_2$, also known as Milk of Magnesia, is a mild alkaline antacid that neutralizes hyperacidity without harming mucosal tissues.', 'मिल्क ऑफ मैग्नीशिया [$\text{Mg(OH)}_2$] एक सौम्य क्षार है जिसका उपयोग पेट की एसिडिटी को दूर करने के लिए एंटासिड के रूप में किया जाता है।'),
  ('rrb_cbt_mock_1', 6, 1, 'PART-1', 'General Science', '', 'Moderate', 'According to Joule''s law of heating, the heat produced in a resistor ($H$) is directly proportional to:', 'जूल के तापन नियम के अनुसार, किसी प्रतिरोधक में उत्पन्न ऊष्मा ($H$) किसके समानुपाती होती है?', '{"a":"Current ($I$)","b":"Square of current ($I^2$)","c":"Cube of current ($I^3$)","d":"Inverse of resistance ($1/R$)"}'::jsonb, '{"a":"धारा ($I$)","b":"विद्युत धारा के वर्ग ($I^2$)","c":"धारा के घन ($I^3$)","d":"प्रतिरोध के व्युत्क्रम"}'::jsonb, 'b', 'Joule''s law states $H = I^2 R t$. Heat is directly proportional to the square of current ($I^2$), resistance ($R$), and time ($t$).', 'जूल का तापन नियम: $H = I^2Rt$। उत्पन्न ऊष्मा धारा के वर्ग ($I^2$), प्रतिरोध और समय के समानुपाती होती है।'),
  ('rrb_cbt_mock_1', 7, 1, 'PART-1', 'General Science', '', 'Moderate', 'Graphite conducts electricity effectively whereas diamond does not, because in graphite:', 'ग्रेफाइट विद्युत का सुचालक है जबकि हीरा कुचालक, क्योंकि ग्रेफाइट में:', '{"a":"Each carbon has 4 covalent bonds","b":"Each carbon atom is bonded to 3 other carbons leaving one free mobile electron","c":"Carbon atoms are arranged in a rigid 3D tetrahedron","d":"Graphite contains metallic impurities"}'::jsonb, '{"a":"प्रत्येक कार्बन के 4 सहसंयोजक बंध होते हैं","b":"प्रत्येक कार्बन 3 अन्य कार्बनों से जुड़ा होता है और एक मुक्त इलेक्ट्रॉन उपलब्ध रहता है","c":"कार्बन परमाणु त्रिविमीय चतुष्फलकीय संरचना में होते हैं","d":"ग्रेफाइट में धात्विक अशुद्धियाँ होती हैं"}'::jsonb, 'b', 'In graphite, each carbon atom is $sp^2$ hybridized and bonded to 3 carbons in planar hexagonal layers. The 4th valence electron is delocalized and conducts current.', 'ग्रेफाइट में प्रत्येक कार्बन 3 अन्य कार्बनों से जुड़ा होता है ($sp^2$) और चौथा इलेक्ट्रॉन मुक्त अवस्था में परतों के बीच गतिशील होकर विद्युत चालन करता है।'),
  ('rrb_cbt_mock_1', 8, 1, 'PART-1', 'General Science', '', 'Moderate', 'What is ''Dry Ice'' chemically composed of?', '''शुष्क बर्फ'' (Dry Ice) रासायनिक रूप से क्या होती है?', '{"a":"Solid water at -50°C","b":"Solid Carbon Dioxide (CO₂)","c":"Liquid Nitrogen","d":"Solid Sulphur Dioxide"}'::jsonb, '{"a":"ठोस जल","b":"ठोस कार्बन डाइऑक्साइड (Solid CO₂)","c":"तरल नाइट्रोजन","d":"ठोस सल्फर डाइऑक्साइड"}'::jsonb, 'b', 'Dry Ice is the solid state of Carbon Dioxide ($CO_2$). Under normal atmospheric pressure, it sublimes directly from solid to gas at -78.5°C without melting into a liquid.', 'शुष्क बर्फ ठोस कार्बन डाइऑक्साइड ($	ext{CO}_2$) होती है, जो सामान्य दाब पर बिना पिघले सीधे गैस में परिवर्तित (उर्ध्वपातन) हो जाती है।'),
  ('rrb_cbt_mock_1', 9, 1, 'PART-1', 'General Science', '', 'Moderate', 'The quantitative measure of the inertia of a body is given by its:', 'किसी वस्तु के जड़त्व (Inertia) का मात्रात्मक माप क्या होता है?', '{"a":"Velocity","b":"Mass","c":"Volume","d":"Surface area"}'::jsonb, '{"a":"वेग","b":"द्रव्यमान (Mass)","c":"आयतन","d":"पृष्ठीय क्षेत्रफल"}'::jsonb, 'b', 'Inertia is the inherent resistance of an object to changes in its state of motion. Mass ($m$) is the direct quantitative measure of inertia.', 'किसी वस्तु का द्रव्यमान उसके जड़त्व का प्रत्यक्ष माप होता है। अधिक द्रव्यमान वाली वस्तु का जड़त्व अधिक होता है।'),
  ('rrb_cbt_mock_1', 10, 1, 'PART-1', 'General Science', '', 'Moderate', 'Bauxite is the principal and commercial mineral ore of which metal?', 'बॉक्साइट (Bauxite) किस धातु का प्रमुख और व्यावसायिक खनिज अयस्क है?', '{"a":"Iron","b":"Aluminium","c":"Copper","d":"Lead"}'::jsonb, '{"a":"लोहा (हेमेटाइट)","b":"एल्युमिनियम (Aluminium - Al₂O₃·2H₂O)","c":"तांबा (कॉपर पाइराइट)","d":"सीसा (गैलेना)"}'::jsonb, 'b', 'Bauxite (hydrated aluminium oxide, $\text{Al}_2\text{O}_3\cdot 2\text{H}_2\text{O}$) is the primary industrial ore from which aluminium is extracted via the Bayer and Hall-Héroult processes.', 'बॉक्साइट ($	ext{Al}_2	ext{O}_3\cdot 2	ext{H}_2	ext{O}$) एल्युमिनियम का मुख्य अयस्क है। भारत में ओडिशा इसका प्रमुख उत्पादक राज्य है।'),
  ('rrb_cbt_mock_1', 11, 1, 'PART-1', 'General Science', '', 'Moderate', 'The SI unit of electrical conductance is:', 'विद्युत चालकत्व (Electrical Conductance) का SI मात्रक क्या है?', '{"a":"Ohm-metre","b":"Siemens","c":"Henry","d":"Tesla"}'::jsonb, '{"a":"ओम-मीटर","b":"सीमेंस (Siemens)","c":"हेनरी","d":"टेस्ला"}'::jsonb, 'b', 'Electrical conductance ($G$) is the reciprocal of resistance ($G = 1/R$). Its SI unit is Siemens ($S$), formerly known as mho ($\Omega^{-1}$).', 'विद्युत चालकत्व ($G$) प्रतिरोध का व्युत्क्रम होता है ($G = 1/R$)। इसका SI मात्रक सीमेंस ($S$) है, जिसे पहले म्हो ($\Omega^{-1}$) भी कहा जाता था।'),
  ('rrb_cbt_mock_1', 12, 1, 'PART-1', 'General Science', '', 'Moderate', 'The primary structural and functional microscopic units in human lungs where gas exchange ($O_2$ and $CO_2$) occurs are called:', 'मानव फेफड़ों में वे प्राथमिक सूक्ष्म संरचनात्मक एवं कार्यात्मक इकाइयाँ जहाँ गैसों ($O_2$ तथा $CO_2$) का आदान-प्रदान होता है, क्या कहलाती हैं?', '{"a":"Bronchioles","b":"Alveoli","c":"Pleural cavities","d":"Tracheal rings"}'::jsonb, '{"a":"श्वसनिकाएँ (Bronchioles)","b":"कूपिकाएँ (Alveoli / एल्वियोली)","c":"फुफ्फुस गुहाएँ","d":"श्वासनली के छल्ले"}'::jsonb, 'b', 'Alveoli are microscopic cup-shaped pouches surrounded by extensive capillary beds, maximizing the surface area for rapid gas diffusion during respiration.', 'कूपिकाएँ (Alveoli) फेफड़ों में सूक्ष्म वायु थैलियाँ होती हैं जो रक्त केशिकाओं के घने जाल से घिरी होती हैं और गैसों के तीव्र विसरण के लिए विशाल सतह प्रदान करती हैं।'),
  ('rrb_cbt_mock_1', 13, 1, 'PART-1', 'General Science', '', 'Moderate', 'If a wire of length L and uniform cross-sectional area A has a resistance of 16 Ω, what will be the resistance of another wire of the same material having length 2L and cross-sectional area 2A?', 'यदि L लंबाई और एकसमान अनुप्रस्थ काट क्षेत्रफल A वाले एक तार का प्रतिरोध 16 Ω है, तो उसी पदार्थ से बने 2L लंबाई और 2A अनुप्रस्थ काट क्षेत्रफल वाले दूसरे तार का प्रतिरोध क्या होगा?', '{"a":"8 Ω","b":"16 Ω","c":"32 Ω","d":"64 Ω"}'::jsonb, '{"a":"8 Ω","b":"16 Ω","c":"32 Ω","d":"64 Ω"}'::jsonb, 'b', 'Resistance formula: R = ρ × (L / A).
For the new wire:
R'' = ρ × (2L / 2A) = ρ × (L / A) = R = 16 Ω.
Since both length and cross-sectional area doubled, the ratio (L/A) remains unchanged.

Correct Option: (b)', 'प्रतिरोध का सूत्र: R = ρ × (L / A).
नए तार के लिए:
R'' = ρ × (2L / 2A) = ρ × (L / A) = 16 Ω.
चूँकि लंबाई और क्षेत्रफल दोनों दोगुने हो गए हैं, अतः प्रतिरोध अपरिवर्तित रहेगा।

अतः सही उत्तर (b) है।'),
  ('rrb_cbt_mock_1', 14, 1, 'PART-1', 'General Science', '', 'Moderate', 'Optical fibres used in modern high-speed telecommunications transmit light signals based on which optical principle?', 'आधुनिक उच्च-गति दूरसंचार में उपयोग किए जाने वाले ऑप्टिकल फाइबर (प्रकाशिक तंतु) किस प्रकाशीय सिद्धांत के आधार पर प्रकाश संकेतों का संचरण करते हैं?', '{"a":"Diffraction of light","b":"Total Internal Reflection","c":"Interference of light","d":"Polarization of light"}'::jsonb, '{"a":"प्रकाश का विवर्तन","b":"पूर्ण आंतरिक परावर्तन (Total Internal Reflection)","c":"प्रकाश का व्यतिकरण","d":"प्रकाश का ध्रुवण"}'::jsonb, 'b', 'Optical fibres transmit light by repeated Total Internal Reflection (TIR). Light entering the denser core at an angle greater than the critical angle strikes the core-cladding boundary and undergoes total internal reflection without loss of signal strength.

Correct Option: (b)', 'ऑप्टिकल फाइबर पूर्ण आंतरिक परावर्तन (Total Internal Reflection) के सिद्धांत पर कार्य करते हैं। जब प्रकाश क्रांतिक कोण से अधिक कोण पर सघन क्रोड में प्रवेश करता है, तो वह बिना ऊर्जा ह्रास के बार-बार परावर्तित होकर आगे बढ़ता है।

अतः सही उत्तर (b) है।'),
  ('rrb_cbt_mock_1', 15, 1, 'PART-1', 'General Science', '', 'Moderate', 'An electric generator (dynamo) converts mechanical energy into electrical energy based on which physical phenomenon?', 'एक विद्युत जनरेटर (डायनेमो) किस भौतिक परिघटना के आधार पर यांत्रिक ऊर्जा को विद्युत ऊर्जा में परिवर्तित करता है?', '{"a":"Thermal Emission","b":"Electromagnetic Induction","c":"Photoelectric Effect","d":"Joule''s Heating Effect"}'::jsonb, '{"a":"तापीय उत्सर्जन","b":"विद्युत चुम्बकीय प्रेरण (Electromagnetic Induction)","c":"प्रकाश विद्युत प्रभाव","d":"जूल का तापन प्रभाव"}'::jsonb, 'b', 'Electric generators operate on the principle of Electromagnetic Induction discovered by Michael Faraday in 1831. Rotating a coil inside a magnetic field induces an electromotive force (EMF) and electric current in the coil.

Correct Option: (b)', 'विद्युत जनरेटर 1831 में माइकल फैराडे द्वारा खोजे गए ''विद्युत चुम्बकीय प्रेरण'' के सिद्धांत पर कार्य करता है। चुंबकीय क्षेत्र में कुंडली को घुमाने पर उसमें प्रेरित विद्युत वाहक बल और विद्युत धारा उत्पन्न होती है।

अतः सही उत्तर (b) है।'),
  ('rrb_cbt_mock_1', 16, 1, 'PART-1', 'General Science', '', 'Moderate', 'Cellular respiration, the metabolic process by which glucose is broken down to release energy in cells, is classified as which type of chemical reaction?', 'कोशिकीय श्वसन, जिसके द्वारा कोशिकाओं में ऊर्जा मुक्त करने के लिए ग्लूकोज का विघटन होता है, किस प्रकार की रासायनिक अभिक्रिया के रूप में वर्गीकृत किया जाता है?', '{"a":"Endothermic reaction","b":"Exothermic reaction","c":"Photochemical reaction","d":"Electrolytic reaction"}'::jsonb, '{"a":"ऊष्माशोषी अभिक्रिया","b":"ऊष्माक्षेपी अभिक्रिया (Exothermic reaction)","c":"प्रकाश रासायनिक अभिक्रिया","d":"विद्युत अपघटनी अभिक्रिया"}'::jsonb, 'b', 'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + Energy (ATP).
Because energy is released during the breakdown of glucose to sustain cellular activities, respiration is an exothermic reaction. (Photosynthesis absorbs energy and is endothermic).

Correct Option: (b)', 'श्वसन प्रक्रिया में ग्लूकोज ऑक्सीजन के साथ मिलकर कार्बन डाइऑक्साइड और जल बनाता है तथा भारी मात्रा में ऊर्जा (ATP) मुक्त होती है। ऊर्जा मुक्त होने के कारण यह एक ऊष्माक्षेपी (Exothermic) अभिक्रिया है।

अतः सही उत्तर (b) है।'),
  ('rrb_cbt_mock_1', 17, 1, 'PART-1', 'General Science', '', 'Moderate', 'If the linear momentum of a moving body is doubled while keeping its mass constant, its kinetic energy becomes:', 'यदि किसी गतिमान पिंड के द्रव्यमान को स्थिर रखते हुए उसके रेखीय संवेग को दोगुना कर दिया जाए, तो उसकी गतिज ऊर्जा हो जाएगी:', '{"a":"2 times","b":"4 times","c":"Half","d":"Constant"}'::jsonb, '{"a":"2 गुनी","b":"4 गुनी","c":"आधी","d":"अपरिवर्तित"}'::jsonb, 'b', 'The relationship between Kinetic Energy (K) and linear momentum (p) is:
K = p^2 / (2m)
If momentum is doubled (p'' = 2p):
K'' = (2p)^2 / (2m) = 4 * [p^2 / (2m)] = 4K.
Hence, the kinetic energy becomes 4 times the initial kinetic energy.

Correct Option: (b)', 'गतिज ऊर्जा (K) और संवेग (p) का संबंध:
K = p^2 / (2m)
यदि संवेग दोगुना हो जाए (p'' = 2p):
K'' = (2p)^2 / (2m) = 4 * (p^2 / 2m) = 4K.
अतः गतिज ऊर्जा प्रारंभिक मान की 4 गुनी हो जाएगी।

अतः सही उत्तर (b) है।'),
  ('rrb_cbt_mock_1', 18, 1, 'PART-1', 'General Science', '', 'Moderate', 'In which of the following media does sound travel with the highest speed at 25°C?', '25°C तापमान पर निम्नलिखित में से किस माध्यम में ध्वनि की चाल सर्वाधिक होती है?', '{"a":"Air","b":"Water","c":"Aluminium","d":"Kerosene"}'::jsonb, '{"a":"वायु","b":"जल","c":"एल्युमीनियम","d":"केरोसिन"}'::jsonb, 'c', 'Sound is a mechanical longitudinal wave requiring an elastic medium. Speed of sound depends on the elasticity and density of the medium (Solids > Liquids > Gases).
Approximate speeds at 25°C:
- Aluminium (solid): ~6,420 m/s
- Distilled Water (liquid): ~1,498 m/s
- Kerosene (liquid): ~1,324 m/s
- Air (gas): ~346 m/s
Hence, sound travels fastest in aluminium.

Correct Option: (c)', 'ध्वनि तरंगें ठोस माध्यम में सर्वाधिक गति से चलती हैं क्योंकि ठोस पदार्थों का प्रत्यास्थता गुणांक उच्च होता है।
25°C पर ध्वनि की चाल:
- एल्युमीनियम: ~6420 m/s
- जल: ~1498 m/s
- वायु: ~346 m/s
अतः एल्युमीनियम में ध्वनि की चाल सर्वाधिक होती है।

अतः सही उत्तर (c) है।'),
  ('rrb_cbt_mock_1', 19, 1, 'PART-1', 'General Science', '', 'Moderate', 'If a cylindrical uniform metallic wire of resistance R is stretched such that its length is doubled while its volume remains constant, what will be its new resistance?', 'यदि R प्रतिरोध वाले एक समान बेलनाकार धातु के तार को इस प्रकार खींचा जाता है कि उसका आयतन स्थिर रहते हुए उसकी लंबाई दोगुनी हो जाती है, तो उसका नया प्रतिरोध क्या होगा?', '{"a":"2R","b":"4R","c":"R/2","d":"R/4"}'::jsonb, '{"a":"2R","b":"4R","c":"R/2","d":"R/4"}'::jsonb, 'b', 'Resistance is given by R = ρ * (L / A).
When a wire is stretched without adding mass:
- Volume V = A * L remains constant.
- If length L'' = 2L, the cross-sectional area becomes A'' = A / 2.
New resistance R'' = ρ * (L'' / A'') = ρ * (2L / (A / 2)) = 4 * [ρ * (L / A)] = 4R.
Hence, the new resistance becomes 4 times the initial resistance.

Correct Option: (b)', 'प्रतिरोध का सूत्र: R = ρ * (L / A).
तार को खींचने पर आयतन (V = A * L) स्थिर रहता है।
यदि लंबाई L'' = 2L हो जाए, तो अनुप्रस्थ काट का क्षेत्रफल A'' = A / 2 हो जाएगा।
नया प्रतिरोध R'' = ρ * (2L) / (A / 2) = 4 * (ρ L / A) = 4R.
अतः नया प्रतिरोध प्रारंभिक मान का 4 गुना हो जाएगा।

अतः सही उत्तर (b) है।'),
  ('rrb_cbt_mock_1', 20, 1, 'PART-1', 'General Science', '', 'Moderate', 'When ethanoic acid reacts with ethanol in the presence of an acid catalyst, a sweet, fruity-smelling compound is formed. What class of chemical compounds does it belong to?', 'जब एथेनोइक अम्ल एक अम्ल उत्प्रेरक की उपस्थिति में एथेनॉल के साथ अभिक्रिया करता है, तो एक मीठी, फलों जैसी गंध वाला यौगिक बनता है। यह किस वर्ग का रासायनिक यौगिक है?', '{"a":"Ester","b":"Aldehyde","c":"Ketone","d":"Ether"}'::jsonb, '{"a":"एस्टर (Ester)","b":"एल्डिहाइड (Aldehyde)","c":"कीटोन (Ketone)","d":"ईथर (Ether)"}'::jsonb, 'a', 'The reaction of a carboxylic acid with an alcohol in the presence of concentrated H2SO4 produces an ester and water:
CH3COOH + C2H5OH -> CH3COOC2H5 (Ethyl ethanoate) + H2O
This process is called Esterification. Esters possess pleasant fruity smells and are used in perfumes and artificial flavouring agents.

Correct Option: (a)', 'सांद्र H2SO4 की उपस्थिति में कार्बोक्सिलिक अम्ल और एल्कोहॉल की अभिक्रिया से एस्टर (Ester) बनता है:
CH3COOH + C2H5OH -> CH3COOC2H5 + H2O
इस प्रक्रिया को एस्टरीकरण कहते हैं। एस्टर की गंध फलों जैसी मीठी होती है और इसका उपयोग इत्र तथा स्वादवर्धक पदार्थों में होता है।

अतः सही उत्तर (a) है।'),
  ('rrb_cbt_mock_1', 21, 1, 'PART-1', 'General Science', '', 'Moderate', 'What is the minimum distance required between a source of sound and a reflecting surface to hear a distinct echo in air at 22°C (speed of sound = 344 m/s)?', '22°C तापमान पर वायु में (ध्वनि की चाल = 344 मी/से) एक स्पष्ट प्रतिध्वनि (Echo) सुनने के लिए ध्वनि स्रोत और परावर्तक सतह के बीच न्यूनतम कितनी दूरी होनी चाहिए?', '{"a":"11.2 m","b":"17.2 m","c":"34.4 m","d":"25.0 m"}'::jsonb, '{"a":"11.2 मीटर","b":"17.2 मीटर","c":"34.4 मीटर","d":"25.0 मीटर"}'::jsonb, 'b', 'The sensation of sound persists in the human brain for about 0.1 s (persistence of hearing).
For an echo to be clearly distinguished, the reflected sound must reach the ear after at least 0.1 s.
Total distance travelled by sound (forth and back) = 2d = v * t = 344 * 0.1 = 34.4 m.
Therefore, minimum distance to the reflector d = 34.4 / 2 = 17.2 meters.

Correct Option: (b)', 'मानव कान पर ध्वनि का प्रभाव 0.1 सेकंड तक रहता है।
स्पष्ट प्रतिध्वनि सुनने के लिए ध्वनि द्वारा तय कुल दूरी (जाना + आना) = v * t = 344 * 0.1 = 34.4 मीटर होनी चाहिए।
अतः परावर्तक सतह की न्यूनतम दूरी d = 34.4 / 2 = 17.2 मीटर होनी चाहिए।

अतः सही उत्तर (b) है।'),
  ('rrb_cbt_mock_1', 22, 1, 'PART-1', 'General Science', '', 'Moderate', 'Four electric bulbs of 60 W each are used for 5 hours daily in a household. How many units (kWh) of electrical energy are consumed by these bulbs in a month of 30 days?', 'एक घर में प्रतिदिन 60 W के चार विद्युत बल्ब 5 घंटे जलाए जाते हैं। 30 दिनों के एक महीने में इन बल्बों द्वारा कितने यूनिट (kWh) विद्युत ऊर्जा की खपत होगी?', '{"a":"36 units","b":"30 units","c":"40 units","d":"45 units"}'::jsonb, '{"a":"36 यूनिट","b":"30 यूनिट","c":"40 यूनिट","d":"45 यूनिट"}'::jsonb, 'a', 'Total power = 4 bulbs * 60 W = 240 W = 0.24 kW.
Daily operating time = 5 hours.
Total hours in 30 days = 5 * 30 = 150 hours.
Electrical energy consumed = Power (kW) * Time (hours)
Energy = 0.24 kW * 150 h = 36 kWh = 36 units.

Correct Option: (a)', 'कुल शक्ति = 4 * 60 = 240 वाट = 0.24 किलोवाट।
30 दिनों में कुल समय = 5 * 30 = 150 घंटे।
विद्युत ऊर्जा = शक्ति (kW) * समय (घंटे) = 0.24 * 150 = 36 kWh = 36 यूनिट।

अतः सही उत्तर (a) है।'),
  ('rrb_cbt_mock_1', 23, 1, 'PART-1', 'General Science', '', 'Moderate', 'Through which mode of heat transfer does solar thermal energy travel across the vacuum of outer space to reach the Earth?', 'ऊष्मा स्थानांतरण की किस विधि द्वारा सूर्य की तापीय ऊर्जा बाह्य अंतरिक्ष के निर्वात से होकर पृथ्वी तक पहुँचती है?', '{"a":"Radiation","b":"Conduction","c":"Convection","d":"Advection"}'::jsonb, '{"a":"विकिरण (Radiation)","b":"चालन (Conduction)","c":"संवहन (Convection)","d":"अभिवहन (Advection)"}'::jsonb, 'a', 'Thermal radiation travels in the form of electromagnetic waves (infrared radiation) at the speed of light (3 × 10^8 m/s) and requires no material medium for propagation, allowing solar energy to traverse the absolute vacuum of space.
(Conduction and convection require a physical material medium).

Correct Option: (a)', 'विकिरण (Radiation) ऊष्मा संचरण की वह विधि है जिसके लिए किसी भौतिक माध्यम की आवश्यकता नहीं होती। यह विद्युत-चुंबकीय तरंगों (अवरक्त किरणों) के रूप में प्रकाश की चाल से गमन करती है, जिससे सूर्य की ऊष्मा अंतरिक्ष के निर्वात को पार कर पृथ्वी तक पहुंचती है।

अतः सही उत्तर (a) है।'),
  ('rrb_cbt_mock_1', 24, 1, 'PART-1', 'General Science', '', 'Moderate', 'What is the work done by the centripetal force on a body moving in a circular path at constant speed?', 'नियत गति से वृत्ताकार पथ पर गतिमान किसी पिंड पर अभिकेंद्रीय बल (Centripetal force) द्वारा किया गया कार्य कितना होता है?', '{"a":"Maximum positive work","b":"Negative work","c":"Zero","d":"Infinite"}'::jsonb, '{"a":"अधिकतम धनात्मक कार्य","b":"ऋणात्मक कार्य","c":"शून्य","d":"अनंत"}'::jsonb, 'c', 'Centripetal force acts towards the center while displacement is tangential (angle θ = 90°). Work done W = F·d·cos(90°) = 0.', 'अभिकेंद्रीय बल केंद्र की ओर कार्य करता है जबकि विस्थापन स्पर्शरेखीय होता है (कोण θ = 90°)। किया गया कार्य W = F·d·cos(90°) = 0 होता है।'),
  ('rrb_cbt_mock_1', 25, 1, 'PART-1', 'General Science', '', 'Moderate', 'Which plant vascular tissue conducts soluble organic compounds (food) synthesized during photosynthesis?', 'पादपों में कौन सा संवहनी ऊतक प्रकाश संश्लेषण के दौरान संश्लेषित घुलनशील कार्बनिक यौगिकों (भोजन) का संवहन करता है?', '{"a":"Xylem","b":"Phloem","c":"Sclerenchyma","d":"Collenchyma"}'::jsonb, '{"a":"जाइलम (Xylem)","b":"फ्लोएम (Phloem)","c":"दृढ़ोतक (Sclerenchyma)","d":"स्थूलकोणोतक (Collenchyma)"}'::jsonb, 'b', 'Phloem transports synthesized nutrients and sugars from leaves to all parts of the plant (translocation). Xylem conducts water and minerals.', 'फ्लोएम पत्तियों से पौधे के सभी भागों में भोजन और शर्करा का संवहन (स्थानांतरण) करता है। जाइलम जल और खनिजों का परिवहन करता है।'),
  ('rrb_cbt_mock_1', 26, 2, 'PART-2', 'Mathematics', '', 'Moderate', 'A mixture of 64 litres contains milk and water in the ratio 5 : 3. How much water must be added to make the ratio 5 : 5 (1 : 1)?', '64 लीटर के मिश्रण में दूध और पानी का अनुपात 5 : 3 है। इसमें कितना पानी मिलाया जाए कि नया अनुपात 5 : 5 (1 : 1) हो जाए?', '{"a":"12 litres","b":"16 litres","c":"18 litres","d":"20 litres"}'::jsonb, '{"a":"12 लीटर","b":"16 लीटर","c":"18 लीटर","d":"20 लीटर"}'::jsonb, 'b', 'Total parts = 5 + 3 = 8. Milk = $(5/8) \times 64 = 40$ L, Water = $(3/8) \times 64 = 24$ L. To make water equal to milk (40 L), added water = $40 - 24 = 16$ litres.', 'कुल भाग = 8। दूध = $(5/8) \times 64 = 40$ लीटर, पानी = 24 लीटर। पानी को दूध के बराबर (40 लीटर) करने के लिए मिलाया गया पानी = $40 - 24 = 16$ लीटर।'),
  ('rrb_cbt_mock_1', 27, 2, 'PART-2', 'Mathematics', '', 'Moderate', 'What will be the compound interest on ₹10,000 for 1 year at 20% per annum, compounded half-yearly?', '₹10,000 पर 20% वार्षिक दर से 1 वर्ष का चक्रवृद्धि ब्याज क्या होगा, यदि ब्याज अर्धवार्षिक रूप से संयोजित होता है?', '{"a":"₹2,000","b":"₹2,100","c":"₹2,200","d":"₹2,250"}'::jsonb, '{"a":"₹2,000","b":"₹2,100","c":"₹2,200","d":"₹2,250"}'::jsonb, 'b', 'Half-yearly rate $R = 20/2 = 10\%$, periods $n = 2$. Amount $= 10000 \times (1.10)^2 = 10000 \times 1.21 = ₹12,100$. CI $= 12100 - 10000 = ₹2,100$.', 'अर्धवार्षिक दर = 10%, समयावधि = 2 अर्धवर्ष। मिश्रधन = $10000 \times (1.10)^2 = ₹12,100$। चक्रवृद्धि ब्याज = ₹2,100।'),
  ('rrb_cbt_mock_1', 28, 2, 'PART-2', 'Mathematics', '', 'Moderate', 'A boat goes 24 km upstream in 6 hours and 36 km downstream in 4 hours. Find the speed of the boat in still water.', 'एक नाव धारा के प्रतिकूल (Upstream) 24 किमी 6 घंटे में और धारा के अनुकूल (Downstream) 36 किमी 4 घंटे में जाती है। शांत जल में नाव की चाल ज्ञात कीजिए।', '{"a":"5.5 km/h","b":"6.0 km/h","c":"6.5 km/h","d":"7.0 km/h"}'::jsonb, '{"a":"5.5 किमी/घंटा","b":"6.0 किमी/घंटा","c":"6.5 किमी/घंटा","d":"7.0 किमी/घंटा"}'::jsonb, 'c', 'Upstream speed $u = 24/6 = 4$ km/h. Downstream speed $v = 36/4 = 9$ km/h. Boat speed in still water $= (v + u)/2 = (9 + 4)/2 = 6.5$ km/h.', 'धारा के प्रतिकूल चाल $= 4$ किमी/घंटा, अनुकूल चाल $= 9$ किमी/घंटा। शांत जल में नाव की चाल $= (9 + 4)/2 = 6.5$ किमी/घंटा।'),
  ('rrb_cbt_mock_1', 29, 2, 'PART-2', 'Mathematics', '', 'Moderate', 'Two trains running in opposite directions on parallel tracks cross each other completely in $18\text{ seconds}$. Their lengths are $240\text{ m}$ and $300\text{ m}$. If the speed of the first train is $60\text{ km/h}$, find the speed of the second train.', 'समानांतर पटरियों पर विपरीत दिशाओं में दौड़ रही दो ट्रेनें एक दूसरे को $18\text{ सेकंड}$ में पूरी तरह पार करती हैं। उनकी लंबाइयाँ $240\text{ m}$ और $300\text{ m}$ हैं। यदि पहली ट्रेन की गति $60\text{ km/h}$ है, तो दूसरी ट्रेन की गति ज्ञात कीजिए।', '{"a":"$48\\text{ km/h}$","b":"$52\\text{ km/h}$","c":"$45\\text{ km/h}$","d":"$54\\text{ km/h}$"}'::jsonb, '{"a":"$48\\text{ km/h}$","b":"$52\\text{ km/h}$","c":"$45\\text{ km/h}$","d":"$54\\text{ km/h}$"}'::jsonb, 'a', 'Total distance covered $= 240 + 300 = 540\text{ m}$. Relative speed $= 540 / 18 = 30\text{ m/s} = 30 \times \frac{18}{5} = 108\text{ km/h}$. For opposite directions, $S_{rel} = S_1 + S_2 \implies 60 + S_2 = 108 \implies S_2 = 48\text{ km/h}$.', 'कुल दूरी $= 240 + 300 = 540\text{ m}$। सापेक्ष चाल $= 540 / 18 = 30\text{ m/s} = 30 \times \frac{18}{5} = 108\text{ km/h}$। विपरीत दिशा होने पर: $S_1 + S_2 = 108 \implies 60 + S_2 = 108 \implies S_2 = 48\text{ km/h}$।'),
  ('rrb_cbt_mock_1', 30, 2, 'PART-2', 'Mathematics', '', 'Moderate', 'The ratio of base radius to height of a right circular cone is $3 : 4$. If its curved surface area is $240\pi\text{ cm}^2$, what is its volume?', 'एक लम्ब वृत्तीय शंकु की आधार त्रिज्या और ऊँचाई का अनुपात $3 : 4$ है। यदि इसका वक्र पृष्ठ क्षेत्रफल $240\pi\text{ cm}^2$ है, तो इसका आयतन क्या होगा?', '{"a":"$768\\pi\\text{ cm}^3$","b":"$512\\pi\\text{ cm}^3$","c":"$640\\pi\\text{ cm}^3$","d":"$960\\pi\\text{ cm}^3$"}'::jsonb, '{"a":"$768\\pi\\text{ cm}^3$","b":"$512\\pi\\text{ cm}^3$","c":"$640\\pi\\text{ cm}^3$","d":"$960\\pi\\text{ cm}^3$"}'::jsonb, 'a', 'Let $r = 3x$ and $h = 4x$. Slant height $l = \sqrt{(3x)^2 + (4x)^2} = 5x$. Curved surface area $= \pi r l = \pi (3x)(5x) = 15\pi x^2 = 240\pi \implies x^2 = 16 \implies x = 4$. Thus $r = 12\text{ cm}$, $h = 16\text{ cm}$. Volume $= \frac{1}{3}\pi r^2 h = \frac{1}{3}\pi (144)(16) = 768\pi\text{ cm}^3$.', 'माना त्रिज्या $r = 3x$, ऊँचाई $h = 4x$। तिर्यक ऊँचाई $l = 5x$। वक्र पृष्ठ $= \pi r l = 15\pi x^2 = 240\pi \implies x = 4$। त्रिज्या $= 12\text{ cm}$, ऊँचाई $= 16\text{ cm}$। आयतन $= \frac{1}{3}\pi (12)^2 (16) = 768\pi\text{ cm}^3$।'),
  ('rrb_cbt_mock_1', 31, 2, 'PART-2', 'Mathematics', '', 'Moderate', 'The HCF and LCM of two numbers are 12 and 336 respectively. If one number is 48, find the other number.', 'दो संख्याओं का महत्तम समापवर्तक (HCF) और लघुत्तम समापवर्त्य (LCM) क्रमशः 12 और 336 हैं। यदि एक संख्या 48 है, तो दूसरी संख्या ज्ञात कीजिए।', '{"a":"72","b":"84","c":"96","d":"108"}'::jsonb, '{"a":"72","b":"84","c":"96","d":"108"}'::jsonb, 'b', 'Formula: $\text{Product of numbers} = \text{HCF} \times \text{LCM}$. Second number = $(12 \times 336) / 48 = 336 / 4 = 84$.', 'सूत्र: $\text{पहली संख्या} \times \text{दूसरी संख्या} = \text{HCF} \times \text{LCM}$। अतः दूसरी संख्या = $(12 \times 336) / 48 = 84$।'),
  ('rrb_cbt_mock_1', 32, 2, 'PART-2', 'Mathematics', '', 'Moderate', 'Find the volume of a right circular cone having base radius 7 cm and height 12 cm. (Take $\pi = 22/7$)', '7 सेमी आधार त्रिज्या और 12 सेमी ऊँचाई वाले एक लंबवृत्तीय शंकु का आयतन ज्ञात कीजिए। ($\pi = 22/7$ लें)', '{"a":"528 cm³","b":"616 cm³","c":"748 cm³","d":"836 cm³"}'::jsonb, '{"a":"528 सेमी³","b":"616 सेमी³","c":"748 सेमी³","d":"836 सेमी³"}'::jsonb, 'b', 'Volume of cone $V = \frac{1}{3}\pi r^2 h = \frac{1}{3} \times \frac{22}{7} \times 7 \times 7 \times 12 = 22 \times 7 \times 4 = 616\text{ cm}^3$.', 'शंकु का आयतन = $\frac{1}{3}\pi r^2 h = \frac{1}{3} \times \frac{22}{7} \times 49 \times 12 = 616\text{ cm}^3$।'),
  ('rrb_cbt_mock_1', 33, 2, 'PART-2', 'Mathematics', '', 'Moderate', 'Pipe A can fill a tank in 10 hours and Pipe B can empty it in 15 hours. If both pipes are opened simultaneously, in how many hours will the tank be full?', 'पाइप A एक टंकी को 10 घंटे में भर सकता है और पाइप B इसे 15 घंटे में खाली कर सकता है। यदि दोनों पाइप एक साथ खोल दिए जाएं, तो टंकी कितने घंटों में भर जाएगी?', '{"a":"25 hours","b":"30 hours","c":"20 hours","d":"35 hours"}'::jsonb, '{"a":"25 घंटे","b":"30 घंटे","c":"20 घंटे","d":"35 घंटे"}'::jsonb, 'b', 'Capacity = LCM(10, 15) = 30 units. A fills +3 units/hr, B empties -2 units/hr. Net = +1 unit/hr. Time = $30 / 1 = 30$ hours.', 'टंकी की क्षमता = 30 इकाई। A की दर = +3 इकाई/घंटा, B की दर = -2 इकाई/घंटा। कुल दर = +1 इकाई/घंटा। समय = $30 / 1 = 30$ घंटे।'),
  ('rrb_cbt_mock_1', 34, 2, 'PART-2', 'Mathematics', '', 'Moderate', 'The diagonal of a square is $12\sqrt{2}$ cm. Find its area.', 'एक वर्ग के विकर्ण की लंबाई $12\sqrt{2}$ सेमी है। इसका क्षेत्रफल ज्ञात कीजिए।', '{"a":"128 cm²","b":"144 cm²","c":"164 cm²","d":"288 cm²"}'::jsonb, '{"a":"128 सेमी²","b":"144 सेमी²","c":"164 सेमी²","d":"288 सेमी²"}'::jsonb, 'b', 'Area of square $= \frac{1}{2} \times d^2 = \frac{1}{2} \times (12\sqrt{2})^2 = \frac{1}{2} \times 288 = 144\text{ cm}^2$. Side $a = 12$ cm, Area $= 12^2 = 144\text{ cm}^2$.', 'वर्ग का क्षेत्रफल $= \frac{1}{2} \times d^2 = \frac{1}{2} \times (12\sqrt{2})^2 = \frac{288}{2} = 144\text{ cm}^2$।'),
  ('rrb_cbt_mock_1', 35, 2, 'PART-2', 'Mathematics', '', 'Moderate', 'Solve for $x$ and $y$: $2x + 3y = 19$ and $3x - y = 12$. What is the value of $x + y$?', '$x$ और $y$ के लिए हल कीजिए: $2x + 3y = 19$ और $3x - y = 12$। $x + y$ का मान क्या है?', '{"a":"7","b":"8","c":"9","d":"10"}'::jsonb, '{"a":"7","b":"8","c":"9","d":"10"}'::jsonb, 'b', 'From eq 2: $y = 3x - 12$. Substitute in eq 1: $2x + 3(3x - 12) = 19 \Rightarrow 11x - 36 = 19 \Rightarrow 11x = 55 \Rightarrow x = 5$. Then $y = 3(5) - 12 = 3$. Hence $x + y = 5 + 3 = 8$.', '$3x - y = 12 \Rightarrow y = 3x - 12$। पहले समीकरण में रखने पर: $2x + 3(3x - 12) = 19 \Rightarrow 11x = 55 \Rightarrow x = 5$, $y = 3$। अतः $x + y = 8$।'),
  ('rrb_cbt_mock_1', 36, 2, 'PART-2', 'Mathematics', '', 'Moderate', 'If the number $5432*7$ is completely divisible by 9, find the digit that replaces ''*''.', 'यदि संख्या $5432*7$ संख्या 9 से पूर्णतः विभाज्य है, तो ''*'' के स्थान पर कौन सा अंक आएगा?', '{"a":"4","b":"5","c":"6","d":"7"}'::jsonb, '{"a":"4","b":"5","c":"6","d":"7"}'::jsonb, 'c', 'Sum of digits must be divisible by 9: $5 + 4 + 3 + 2 + * + 7 = 21 + *$. The next multiple of 9 is 27. So $* = 27 - 21 = 6$.', '9 की विभाज्यता: अंकों का योग 9 से कटना चाहिए। $5 + 4 + 3 + 2 + * + 7 = 21 + *$। 21 के बाद 9 का गुणज 27 है। $* = 27 - 21 = 6$।'),
  ('rrb_cbt_mock_1', 37, 2, 'PART-2', 'Mathematics', '', 'Moderate', 'The parallel sides of a trapezium are 14 cm and 20 cm, and the perpendicular distance between them is 8 cm. Find its area.', 'एक समलंब चतुर्भुज की समानांतर भुजाएँ 14 सेमी और 20 सेमी हैं, और उनके बीच की लंबवत दूरी 8 सेमी है। इसका क्षेत्रफल ज्ञात कीजिए।', '{"a":"124 cm²","b":"136 cm²","c":"144 cm²","d":"152 cm²"}'::jsonb, '{"a":"124 सेमी²","b":"136 सेमी²","c":"144 सेमी²","d":"152 सेमी²"}'::jsonb, 'b', 'Area of trapezium $= \frac{1}{2} \times (a + b) \times h = \frac{1}{2} \times (14 + 20) \times 8 = 34 \times 4 = 136\text{ cm}^2$.', 'समलंब का क्षेत्रफल $= \frac{1}{2} \times (\text{समानांतर भुजाओं का योग}) \times \text{ऊँचाई} = \frac{1}{2} \times 34 \times 8 = 136\text{ cm}^2$।'),
  ('rrb_cbt_mock_1', 38, 2, 'PART-2', 'Mathematics', '', 'Moderate', 'A dishonest trader professes to sell his goods at cost price, but uses a false weight of 900 grams for a 1 kg weight. What is his profit percentage?', 'एक बेईमान व्यापारी अपनी वस्तुओं को क्रय मूल्य पर बेचने का दावा करता है, लेकिन 1 किग्रा के स्थान पर 900 ग्राम के गलत बाट का उपयोग करता है। उसका लाभ प्रतिशत क्या है?', '{"a":"10%","b":"$11\\frac{1}{9}\\%$","c":"12%","d":"$12\\frac{1}{2}\\%$"}'::jsonb, '{"a":"10%","b":"$11\\frac{1}{9}\\%$","c":"12%","d":"$12\\frac{1}{2}\\%$"}'::jsonb, 'b', 'Profit $\% = \frac{\text{Error}}{\text{True weight} - \text{Error}} \times 100 = \frac{100}{900} \times 100 = \frac{100}{9}\% = 11\frac{1}{9}\%$.', 'लाभ $\% = \frac{\text{त्रुटि}}{\text{दिया गया मान}} \times 100 = \frac{100}{900} \times 100 = 11\frac{1}{9}\%$।'),
  ('rrb_cbt_mock_1', 39, 2, 'PART-2', 'Mathematics', '', 'Moderate', 'Find the remainder when $2^{31}$ is divided by 5.', '$2^{31}$ को 5 से विभाजित करने पर शेषफल क्या प्राप्त होगा?', '{"a":"1","b":"2","c":"3","d":"4"}'::jsonb, '{"a":"1","b":"2","c":"3","d":"4"}'::jsonb, 'c', '$2^1=2, 2^2=4, 2^3=8\equiv 3\pmod 5, 2^4=16\equiv 1\pmod 5$. Power mod 4: $31 = 4\times 7 + 3$. Remainder $= 2^3 = 8 \equiv 3\pmod 5$.', '$2^4 = 16$, जो 5 से भाग देने पर शेषफल 1 देता है। $2^{31} = (2^4)^7 \times 2^3 = (1)^7 \times 8 = 8$। $8 \div 5$ पर शेषफल 3 आता है।'),
  ('rrb_cbt_mock_1', 40, 2, 'PART-2', 'Mathematics', '', 'Moderate', 'If $\sin \theta = \cos \theta$ for $0^\circ < \theta < 90^\circ$, find the value of $2\tan^2 \theta + \sin^2 \theta - 1$.', 'यदि $0^\circ < \theta < 90^\circ$ के लिए $\sin \theta = \cos \theta$ है, तो $2\tan^2 \theta + \sin^2 \theta - 1$ का मान ज्ञात कीजिए।', '{"a":"1","b":"3/2","c":"2","d":"5/2"}'::jsonb, '{"a":"1","b":"3/2","c":"2","d":"5/2"}'::jsonb, 'b', '$\sin \theta = \cos \theta \Rightarrow \tan \theta = 1 \Rightarrow \theta = 45^\circ$. Expression $= 2(1)^2 + (1/\sqrt{2})^2 - 1 = 2 + 1/2 - 1 = 3/2$.', '$\sin \theta = \cos \theta \Rightarrow \theta = 45^\circ$। मान $= 2(1)^2 + (1/\sqrt{2})^2 - 1 = 2 + 0.5 - 1 = 1.5 = 3/2$।'),
  ('rrb_cbt_mock_1', 41, 2, 'PART-2', 'Mathematics', '', 'Moderate', 'A sum of ₹12,000 amounts to ₹15,600 in 3 years at simple interest. Find the annual rate of interest.', '₹12,000 की राशि साधारण ब्याज की दर से 3 वर्ष में ₹15,600 हो जाती है। वार्षिक ब्याज दर ज्ञात कीजिए।', '{"a":"8%","b":"10%","c":"12%","d":"15%"}'::jsonb, '{"a":"8%","b":"10%","c":"12%","d":"15%"}'::jsonb, 'b', 'Simple interest $= 15600 - 12000 = ₹3,600$. $SI = (P \times R \times T)/100 \Rightarrow 3600 = (12000 \times R \times 3)/100 \Rightarrow 3600 = 360 R \Rightarrow R = 10\%$.', 'साधारण ब्याज = $15600 - 12000 = ₹3,600$। दर $R = \frac{3600 \times 100}{12000 \times 3} = 10\%$ वार्षिक।'),
  ('rrb_cbt_mock_1', 42, 2, 'PART-2', 'Mathematics', '', 'Moderate', 'A sum of money triples itself in 10 years at simple interest. What is the annual rate of interest?', 'कोई धनराशि साधारण ब्याज की दर से 10 वर्षों में स्वयं की 3 गुनी हो जाती है। वार्षिक ब्याज दर क्या है?', '{"a":"15%","b":"20%","c":"25%","d":"30%"}'::jsonb, '{"a":"15%","b":"20%","c":"25%","d":"30%"}'::jsonb, 'b', 'Amount = 3P $\Rightarrow$ Simple Interest $= 3P - P = 2P$. Rate $R = \frac{SI \times 100}{P \times T} = \frac{2P \times 100}{P \times 10} = 20\%$.', 'ब्याज $SI = 2P$। दर $R = \frac{SI \times 100}{P \times T} = \frac{2P \times 100}{P \times 10} = 20\%$ वार्षिक।'),
  ('rrb_cbt_mock_1', 43, 2, 'PART-2', 'Mathematics', '', 'Moderate', 'Find the LCM of the fractions: $\frac{2}{3}, \frac{4}{9}, \frac{5}{6}$.', 'भिन्नों $\frac{2}{3}, \frac{4}{9}, \frac{5}{6}$ का लघुत्तम समापवर्त्य (LCM) ज्ञात कीजिए।', '{"a":"20/3","b":"10/3","c":"20/9","d":"40/3"}'::jsonb, '{"a":"20/3","b":"10/3","c":"20/9","d":"40/3"}'::jsonb, 'a', 'Formula: $\text{LCM of fractions} = \frac{\text{LCM of numerators}}{\text{HCF of denominators}} = \frac{\text{LCM}(2,4,5)}{\text{HCF}(3,9,6)} = \frac{20}{3}$.', 'भिन्नों का LCM = $\frac{\text{अंशों का LCM}}{\text{हरों का HCF}} = \frac{\text{LCM}(2, 4, 5)}{\text{HCF}(3, 9, 6)} = \frac{20}{3}$।'),
  ('rrb_cbt_mock_1', 44, 2, 'PART-2', 'Mathematics', '', 'Moderate', 'A, B, and C can complete a piece of work together in 10 days. If A and B together can do it in 15 days, in how many days can C alone complete the work?', 'A, B और C मिलकर किसी काम को 10 दिनों में पूरा कर सकते हैं। यदि A और B मिलकर इसे 15 दिनों में कर सकते हैं, तो C अकेला उस काम को कितने दिनों में पूरा करेगा?', '{"a":"25 days","b":"30 days","c":"35 days","d":"40 days"}'::jsonb, '{"a":"25 दिन","b":"30 दिन","c":"35 दिन","d":"40 दिन"}'::jsonb, 'b', 'Total work = LCM(10, 15) = 30 units. Efficiency of (A+B+C) = 3 units/day. Efficiency of (A+B) = 2 units/day. C alone = $3 - 2 = 1$ unit/day. Time = $30 / 1 = 30$ days.', 'कुल कार्य = 30 इकाई। (A+B+C) = 3 इकाई/दिन, (A+B) = 2 इकाई/दिन। C की क्षमता = 1 इकाई/दिन। समय = $30 / 1 = 30$ दिन।'),
  ('rrb_cbt_mock_1', 45, 2, 'PART-2', 'Mathematics', '', 'Moderate', 'The mean of a dataset is $24$ and its variance is $16$. If every observation in the dataset is multiplied by $3$ and then increased by $5$, what are the new mean and new variance?', 'एक डेटासेट का माध्य $24$ और प्रसरण (Variance) $16$ है। यदि डेटासेट के प्रत्येक प्रेक्षण को $3$ से गुणा किया जाए और फिर $5$ जोड़ा जाए, तो नया माध्य और नया प्रसरण क्या होगा?', '{"a":"New Mean = $77$, New Variance = $144$","b":"New Mean = $72$, New Variance = $48$","c":"New Mean = $77$, New Variance = $53$","d":"New Mean = $72$, New Variance = $144$"}'::jsonb, '{"a":"नया माध्य = $77$, नया प्रसरण = $144$","b":"नया माध्य = $72$, नया प्रसरण = $48$","c":"नया माध्य = $77$, नया प्रसरण = $53$","d":"नया माध्य = $72$, नया प्रसरण = $144$"}'::jsonb, 'a', 'For linear transformation $Y = aX + b$: New mean $= a\bar{X} + b = 3(24) + 5 = 77$. New variance $= a^2 \times \text{Var}(X) = 3^2 \times 16 = 9 \times 16 = 144$ (adding a constant does not change variance).', 'रैखिक रूपांतरण $Y = aX + b$ के लिए: नया माध्य $= a\bar{X} + b = 3(24) + 5 = 77$। नया प्रसरण $= a^2 \times \text{Var}(X) = 3^2 \times 16 = 144$ (अचर जोड़ने पर प्रसरण नहीं बदलता)।'),
  ('rrb_cbt_mock_1', 46, 2, 'PART-2', 'Mathematics', '', 'Moderate', 'In a direct election between two contestants, the winning candidate secured $58\%$ of the valid votes and won by a margin of $3,840$ votes. If all votes polled were valid, find the total number of votes polled.', 'दो उम्मीदवारों के बीच हुए एक सीधे चुनाव में, विजेता उम्मीदवार को कुल वैध मतों का $58\%$ प्राप्त हुआ और वह $3,840$ मतों के अंतर से विजयी हुआ। यदि सभी डाले गए मत वैध थे, तो कुल कितने मत डाले गए?', '{"a":"$24,000$","b":"$20,000$","c":"$25,000$","d":"$28,000$"}'::jsonb, '{"a":"$24,000$","b":"$20,000$","c":"$25,000$","d":"$28,000$"}'::jsonb, 'a', 'Winning candidate percentage = 58%. Losing candidate percentage = 100% - 58% = 42%. Margin of victory = $58\% - 42\% = 16\%$. Since $16\%$ corresponds to 3,840 votes: Total votes $= \frac{3840}{0.16} = 24,000$.', 'विजेता के मत = 58%, पराजित उम्मीदवार के मत = 42%। जीत का अंतर = $58\% - 42\% = 16\%$। यदि 16% = 3,840, तो कुल मत $= \frac{3840}{16} \times 100 = 24,000$।'),
  ('rrb_cbt_mock_1', 47, 2, 'PART-2', 'Mathematics', '', 'Moderate', 'The ratio of the radius and height of a solid right circular cylinder is 2 : 3. If its volume is 12,936 cm³, find its total surface area. (Take π = 22/7)', 'एक ठोस लंब वृत्तीय बेलन की त्रिज्या और ऊंचाई का अनुपात 2 : 3 है। यदि इसका आयतन 12,936 सेमी³ है, तो इसका कुल पृष्ठीय क्षेत्रफल ज्ञात कीजिए। (π = 22/7 लें)', '{"a":"2,860 cm²","b":"3,080 cm²","c":"3,240 cm²","d":"3,520 cm²"}'::jsonb, '{"a":"2,860 सेमी²","b":"3,080 सेमी²","c":"3,240 सेमी²","d":"3,520 सेमी²"}'::jsonb, 'b', 'Let r = 2x and h = 3x.
Volume V = π r² h = (22/7) × (2x)² × (3x) = (22/7) × 12x³ = (264/7) x³ = 12,936.
x³ = (12,936 × 7) / 264 = 49 × 7 = 343 => x = 7.
Radius r = 2 × 7 = 14 cm, Height h = 3 × 7 = 21 cm.
Total Surface Area = 2 π r (r + h) = 2 × (22/7) × 14 × (14 + 21)
= 2 × 22 × 2 × 35 = 88 × 35 = 3,080 cm².

Correct Option: (b)', 'माना r = 2x और h = 3x.
आयतन = π r² h = (22/7) × 4x² × 3x = 12936 => x³ = 343 => x = 7.
r = 14 सेमी, h = 21 सेमी।
कुल पृष्ठीय क्षेत्रफल = 2πr(r + h) = 2 × (22/7) × 14 × 35 = 3,080 सेमी²।

अतः सही उत्तर (b) है।'),
  ('rrb_cbt_mock_1', 48, 2, 'PART-2', 'Mathematics', '', 'Moderate', 'A 60-litre mixture of milk and water contains milk and water in the ratio 2 : 1. How many litres of water must be added to this mixture so that the ratio of milk to water becomes 1 : 2?', 'दूध और पानी के 60 लीटर मिश्रण में दूध और पानी का अनुपात 2 : 1 है। इस मिश्रण में कितने लीटर पानी मिलाया जाना चाहिए ताकि दूध और पानी का अनुपात 1 : 2 हो जाए?', '{"a":"40 litres","b":"60 litres","c":"50 litres","d":"30 litres"}'::jsonb, '{"a":"40 लीटर","b":"60 लीटर","c":"50 लीटर","d":"30 लीटर"}'::jsonb, 'b', 'In 60 litres:
Milk = (2/3) × 60 = 40 litres.
Water = (1/3) × 60 = 20 litres.
Let x litres of water be added. The milk quantity remains 40 litres:
Milk / Water = 40 / (20 + x) = 1 / 2
20 + x = 80 => x = 60 litres.

Correct Option: (b)', 'प्रारंभिक मात्रा: दूध = 40 लीटर, पानी = 20 लीटर।
माना x लीटर पानी मिलाया जाता है:
40 / (20 + x) = 1 / 2 => 20 + x = 80 => x = 60 लीटर।

अतः सही उत्तर (b) है।'),
  ('rrb_cbt_mock_1', 49, 2, 'PART-2', 'Mathematics', '', 'Moderate', 'A, B, and C enter into a partnership. A invests 3 times as much as B invests, and B invests two-thirds of what C invests. What is the ratio of their capital investments?', 'A, B और C एक साझेदारी में प्रवेश करते हैं। A, B के निवेश का 3 गुना निवेश करता है, और B, C के निवेश का दो-तिहाई निवेश करता है। उनके पूंजी निवेश का अनुपात क्या है?', '{"a":"6 : 2 : 3","b":"3 : 2 : 3","c":"6 : 3 : 2","d":"9 : 3 : 2"}'::jsonb, '{"a":"6 : 2 : 3","b":"3 : 2 : 3","c":"6 : 3 : 2","d":"9 : 3 : 2"}'::jsonb, 'a', 'Let C''s investment = 3 units.
Then B''s investment = 2/3 of 3 = 2 units.
A''s investment = 3 × B = 3 × 2 = 6 units.
Ratio A : B : C = 6 : 2 : 3.

Correct Option: (a)', 'माना C का निवेश = 3 इकाई।
B का निवेश = 3 का 2/3 = 2 इकाई।
A का निवेश = 3 × 2 = 6 इकाई।
अनुपात A : B : C = 6 : 2 : 3.

अतः सही उत्तर (a) है।'),
  ('rrb_cbt_mock_1', 50, 2, 'PART-2', 'Mathematics', '', 'Moderate', 'A motorboat travels 24 km downstream in 2 hours and takes 4 hours to travel the same distance upstream. What is the speed of the water current?', 'एक मोटरबोट धारा के अनुकूल 24 किमी की दूरी 2 घंटे में तय करती है और धारा के प्रतिकूल समान दूरी तय करने में 4 घंटे का समय लेती है। जलधारा की गति क्या है?', '{"a":"2 km/h","b":"3 km/h","c":"4 km/h","d":"6 km/h"}'::jsonb, '{"a":"2 किमी/घंटा","b":"3 किमी/घंटा","c":"4 किमी/घंटा","d":"6 किमी/घंटा"}'::jsonb, 'b', 'Downstream speed v_down = 24 / 2 = 12 km/h.
Upstream speed v_up = 24 / 4 = 6 km/h.
Speed of water current = (v_down - v_up) / 2 = (12 - 6) / 2 = 6 / 2 = 3 km/h.
(Speed of boat in still water = (12 + 6)/2 = 9 km/h).

Correct Option: (b)', 'अनुकूल गति = 24 / 2 = 12 किमी/घंटा।
प्रतिकूल गति = 24 / 4 = 6 किमी/घंटा।
धारा की गति = (12 - 6) / 2 = 3 किमी/घंटा।

अतः सही उत्तर (b) है।'),
  ('rrb_cbt_mock_1', 51, 3, 'PART-3', 'General Intelligence & Reasoning', '', 'Moderate', 'In a certain code language, ''RAILWAY'' is coded as ''TCKNYCA''. How will ''STATION'' be coded in that same language?', 'एक निश्चित कूट भाषा में ''RAILWAY'' को ''TCKNYCA'' लिखा जाता है। उसी कूट भाषा में ''STATION'' को किस प्रकार लिखा जाएगा?', '{"a":"UVCVKQP","b":"UVBVKPO","c":"TVCUKQP","d":"UVCWLRQ"}'::jsonb, '{"a":"UVCVKQP","b":"UVBVKPO","c":"TVCUKQP","d":"UVCWLRQ"}'::jsonb, 'a', 'The pattern adds $+2$ to each letter''s alphabetical rank: R(+2)->T, A(+2)->C, I(+2)->K, L(+2)->N, W(+2)->Y, A(+2)->C, Y(+2)->A. Applying to STATION: S(+2)=U, T(+2)=V, A(+2)=C, T(+2)=V, I(+2)=K, O(+2)=Q, N(+2)=P -> ''UVCVKQP''.', 'पैटर्न में प्रत्येक अक्षर के वर्णमाला क्रम में $+2$ जोड़ा गया है: R(+2)->T, A(+2)->C, आदि। अतः STATION के लिए: S(+2)=U, T(+2)=V, A(+2)=C, T(+2)=V, I(+2)=K, O(+2)=Q, N(+2)=P -> ''UVCVKQP''।'),
  ('rrb_cbt_mock_1', 52, 3, 'PART-3', 'General Intelligence & Reasoning', '', 'Moderate', 'How many times are the hands of a clock at right angles (90°) in a full 24-hour day?', '24 घंटे के एक पूरे दिन में घड़ी की दोनों सुइयां कितनी बार समकोण (90°) पर होती हैं?', '{"a":"22 times","b":"24 times","c":"44 times","d":"48 times"}'::jsonb, '{"a":"22 बार","b":"24 बार","c":"44 बार","d":"48 बार"}'::jsonb, 'c', 'The hands are at right angles twice an hour, but only 22 times in 12 hours (due to overlap around 3 and 9 o''clock). In 24 hours, $22 \times 2 = 44$ times.', 'घड़ी की सुइयां 12 घंटे में 22 बार समकोण बनाती हैं। अतः 24 घंटे में वे $22 \times 2 = 44$ बार समकोण पर होती हैं।'),
  ('rrb_cbt_mock_1', 53, 3, 'PART-3', 'General Intelligence & Reasoning', '', 'Moderate', 'Find the missing number in the series: $7,\ 11,\ 20,\ 36,\ 61,\ ?$ ', 'दी गई संख्या श्रृंखला में लुप्त संख्या ज्ञात कीजिए: $7,\ 11,\ 20,\ 36,\ 61,\ ?$ ', '{"a":"$97$","b":"$95$","c":"$102$","d":"$88$"}'::jsonb, '{"a":"$97$","b":"$95$","c":"$102$","d":"$88$"}'::jsonb, 'a', 'Observe consecutive differences: $11 - 7 = 4 = 2^2$, $20 - 11 = 9 = 3^2$, $36 - 20 = 16 = 4^2$, $61 - 36 = 25 = 5^2$. Next difference must be $6^2 = 36$. Missing term $= 61 + 36 = 97$.', 'क्रमिक अंतर देखिए: $+4 (2^2), +9 (3^2), +16 (4^2), +25 (5^2)$। अगला अंतर $6^2 = 36$ होना चाहिए। अतः लुप्त पद $= 61 + 36 = 97$।'),
  ('rrb_cbt_mock_1', 54, 3, 'PART-3', 'General Intelligence & Reasoning', '', 'Moderate', 'Select the odd pair from the following numerical pairs:
(a) 343 : 7
(b) 729 : 9
(c) 512 : 8
(d) 256 : 6', 'निम्नलिखित संख्या युग्मों में से विषम (Odd) युग्म का चयन कीजिए:
(a) 343 : 7
(b) 729 : 9
(c) 512 : 8
(d) 256 : 6', '{"a":"343 : 7","b":"729 : 9","c":"512 : 8","d":"256 : 6"}'::jsonb, '{"a":"343 : 7","b":"729 : 9","c":"512 : 8","d":"256 : 6"}'::jsonb, 'd', 'In each pair, the first number is the cube of the second number: $7^3 = 343$, $9^3 = 729$, $8^3 = 512$. However, $6^3 = 216 \neq 256$ ($256$ is $4^4$ or $16^2$). Hence (d) is the odd one.', 'प्रत्येक युग्म में पहली संख्या दूसरी संख्या का घन (cube) है: $7^3 = 343$, $9^3 = 729$, $8^3 = 512$। परंतु $6^3 = 216 \neq 256$। अतः विकल्प (d) भिन्न है।'),
  ('rrb_cbt_mock_1', 55, 3, 'PART-3', 'General Intelligence & Reasoning', '', 'Moderate', 'Which Venn diagram configuration represents the relationship among: ''Earth, Sea, and Sun''?', 'कौन सा वेन आरेख ''पृथ्वी, समुद्र, और सूर्य'' के बीच के संबंध का प्रतिनिधित्व करता है?', '{"a":"One circle inside another circle, with a third circle completely outside","b":"Three mutually intersecting circles","c":"Three concentric circles","d":"Three completely separate disjoint circles"}'::jsonb, '{"a":"एक वृत्त दूसरे के अंदर, और तीसरा वृत्त पूरी तरह बाहर","b":"तीन परस्पर प्रतिच्छेदी वृत्त","c":"तीन संकेंद्रित वृत्त","d":"तीन पूरी तरह से अलग वृत्त"}'::jsonb, 'a', 'All seas are geographical features located entirely on planet Earth (Sea circle is inside Earth circle). The Sun is an external celestial star completely separate from Earth.

Correct Option: (a)', 'सभी समुद्र पृथ्वी पर स्थित हैं (समुद्र ⊂ पृथ्वी)। सूर्य एक तारा है जो पृथ्वी से पूर्णतः अलग है। अतः एक वृत्त के अंदर दूसरा वृत्त तथा तीसरा वृत्त अलग बनेगा।

अतः सही उत्तर (a) है।'),
  ('rrb_cbt_mock_1', 56, 3, 'PART-3', 'General Intelligence & Reasoning', '', 'Moderate', 'Statement: Heavy monsoon rains have inundated low-lying areas of the city, causing waterlogging and traffic paralysis.
Courses of Action:
I. The civic administration should deploy emergency water pumps immediately to drain water from major roads.
II. Citizens should be advised through media to avoid unnecessary travel and take alternate elevated routes.', 'कथन: भारी मानसूनी बारिश के कारण शहर के निचले इलाकों में पानी भर गया है, जिससे जलभराव और यातायात ठप हो गया है।
कार्यवाही के उपाय:
I. नागरिक प्रशासन को प्रमुख सड़कों से पानी निकालने के लिए तुरंत आपातकालीन पानी के पंप तैनात करने चाहिए।
II. नागरिकों को मीडिया के माध्यम से सलाह दी जानी चाहिए कि वे अनावश्यक यात्रा से बचें और वैकल्पिक ऊंचे मार्गों का उपयोग करें।', '{"a":"Only I follows","b":"Only II follows","c":"Both I and II follow","d":"Neither I nor II follows"}'::jsonb, '{"a":"केवल I अनुसरण करता है","b":"केवल II अनुसरण करता है","c":"I और II दोनों अनुसरण करते हैं","d":"न तो I और न ही II अनुसरण करता है"}'::jsonb, 'c', '- Course of Action I is a direct and necessary remedial operational measure to restore mobility and remove excess water.
- Course of Action II is a sensible preventive advisory to minimize congestion and protect citizen safety.
Both actions address the problem practically and constructively.

Correct Option: (c)', '- उपाय I जलभराव की समस्या को दूर करने के लिए आवश्यक त्वरित प्रशासनिक कदम है।
- उपाय II नागरिकों की सुरक्षा और जाम से बचने के लिए उचित परामर्श है।
अतः दोनों कार्यवाहियां उचित और आवश्यक हैं।

अतः सही उत्तर (c) है।'),
  ('rrb_cbt_mock_1', 57, 3, 'PART-3', 'General Intelligence & Reasoning', '', 'Moderate', 'A square sheet of transparent paper with a pattern is folded along the dotted middle vertical line from left to right. If the left half has a triangle ''△'' and the right half has a circle ''○'', what does the folded sheet display?', 'पैटर्न वाले पारदर्शी चौकोर कागज को बिंदीदार ऊर्ध्वाधर मध्य रेखा के अनुदिश बाएं से दाएं मोड़ा जाता है। यदि बाएं आधे भाग में एक त्रिभुज ''△'' और दाएं आधे भाग में एक वृत्त ''○'' है, तो मुड़ी हुई शीट पर क्या दिखाई देगा?', '{"a":"The triangle and the circle superimposed together","b":"Only the circle","c":"Only the triangle","d":"A blank sheet"}'::jsonb, '{"a":"त्रिभुज और वृत्त एक-दूसरे के ऊपर अध्यारोपित (Superimposed)","b":"केवल वृत्त","c":"केवल त्रिभुज","d":"एक कोरी शीट"}'::jsonb, 'a', 'Because the paper is transparent, when the left half is folded over the right half, the patterns on both halves remain visible and appear superimposed upon each other.

Correct Option: (a)', 'चूंकि कागज पारदर्शी (Transparent) है, बाएं हिस्से को दाएं हिस्से पर मोड़ने पर त्रिभुज और वृत्त दोनों एक साथ अध्यारोपित होकर दिखाई देंगे।

अतः सही उत्तर (a) है।'),
  ('rrb_cbt_mock_1', 58, 3, 'PART-3', 'General Intelligence & Reasoning', '', 'Moderate', 'How many total triangles are there in a square divided by both diagonals and both horizontal and vertical mid-lines (8 elementary triangular sectors)?', 'दोनों विकर्णों तथा क्षैतिज और ऊर्ध्वाधर मध्य रेखाओं द्वारा 8 छोटे त्रिभुजों में विभाजित एक वर्ग में कुल कितने त्रिभुज होते हैं?', '{"a":"16","b":"12","c":"14","d":"18"}'::jsonb, '{"a":"16","b":"12","c":"14","d":"18"}'::jsonb, 'a', 'Rule for a square divided into n triangular sectors from the center:
Total triangles = 2 * n
Here the square is divided into 8 elementary sectors:
Total triangles = 2 * 8 = 16 triangles.
- Single-sector triangles = 8
- Two-sector triangles (halves of quadrants) = 4
- Four-sector triangles (halves formed by diagonals) = 4
Total = 8 + 4 + 4 = 16.

Correct Option: (a)', 'जब किसी वर्ग में दोनों विकर्ण और दोनों मध्य रेखाएं खींची जाती हैं, तो बनने वाले छोटे त्रिभुज = 8.
कुल त्रिभुज = 8 * 2 = 16.

अतः सही उत्तर (a) है।'),
  ('rrb_cbt_mock_1', 59, 3, 'PART-3', 'General Intelligence & Reasoning', '', 'Moderate', 'Statement: All successful athletes maintain strict nutritional discipline and daily physical training.
Conclusions:
I. A person who does not maintain strict nutritional discipline cannot become a successful athlete.
II. Anyone who exercises daily will definitely become a successful athlete.', 'कथन: सभी सफल एथलीट सख्त पोषण अनुशासन और दैनिक शारीरिक प्रशिक्षण बनाए रखते हैं।
निष्कर्ष:
I. जो व्यक्ति सख्त पोषण अनुशासन नहीं रखता, वह सफल एथलीट नहीं बन सकता।
II. कोई भी व्यक्ति जो प्रतिदिन व्यायाम करता है, वह निश्चित रूप से एक सफल एथलीट बन जाएगा।', '{"a":"Only conclusion I follows","b":"Only conclusion II follows","c":"Both conclusions follow","d":"Neither conclusion follows"}'::jsonb, '{"a":"केवल निष्कर्ष I अनुसरण करता है","b":"केवल निष्कर्ष II अनुसरण करता है","c":"दोनों निष्कर्ष अनुसरण करते हैं","d":"कोई भी निष्कर्ष अनुसरण नहीं करता"}'::jsonb, 'a', '- Statement: Being a successful athlete requires (implies) strict nutritional discipline. Hence, the contrapositive is logically valid: If no nutritional discipline -> not a successful athlete (Conclusion I follows).
- Conclusion II commits the fallacy of affirming the consequent: exercising is necessary, but not sufficient on its own to guarantee athletic success.
Therefore, only conclusion I follows.

Correct Option: (a)', '- कथन के अनुसार सभी सफल एथलीटों के लिए पोषण अनुशासन आवश्यक शर्त है, अतः इसके बिना कोई सफल एथलीट नहीं बन सकता (निष्कर्ष I मान्य है)।
- केवल व्यायाम करने से ही हर व्यक्ति सफल एथलीट नहीं बन जाता (निष्कर्ष II गलत है)।
अतः केवल निष्कर्ष I अनुसरण करता है।

अतः सही उत्तर (a) है।'),
  ('rrb_cbt_mock_1', 60, 3, 'PART-3', 'General Intelligence & Reasoning', '', 'Moderate', 'How many triangles are there in a standard 5-pointed star pentagram?', 'एक मानक 5-नुकीले तारे (पंचतारा / Star pentagram) में कुल कितने त्रिभुज होते हैं?', '{"a":"5","b":"8","c":"10","d":"12"}'::jsonb, '{"a":"5","b":"8","c":"10","d":"12"}'::jsonb, 'c', 'A 5-pointed star has 5 outer small triangular points and 5 larger overlapping triangles formed with each vertex and the opposing internal base line. Total triangles = 5 + 5 = 10.', 'एक 5-नुकीले तारे में 5 बाहरी छोटे नुकीले त्रिभुज होते हैं और प्रत्येक शीर्ष तथा आंतरिक आधार से 5 बड़े त्रिभुज बनते हैं। कुल त्रिभुज = 5 + 5 = 10 होते हैं।'),
  ('rrb_cbt_mock_1', 61, 3, 'PART-3', 'General Intelligence & Reasoning', '', 'Moderate', 'Statement: ''Government has decided to install solar panels on all railway station rooftops.'' Assumptions: I. Solar energy reduces carbon footprint and power bills. II. Stations have sufficient unshaded roof space.', 'कथन: ''सरकार ने सभी रेलवे स्टेशनों की छतों पर सोलर पैनल लगाने का निर्णय लिया है।'' पूर्वधारणाएँ: I. सौर ऊर्जा कार्बन उत्सर्जन और बिजली बिल को कम करती है। II. स्टेशनों पर पर्याप्त छाया-मुक्त छत उपलब्ध है।', '{"a":"Only assumption I is implicit","b":"Only assumption II is implicit","c":"Both assumptions I and II are implicit","d":"Neither I nor II is implicit"}'::jsonb, '{"a":"केवल पूर्वधारणा I अंतर्निहित है","b":"केवल पूर्वधारणा II अंतर्निहित है","c":"दोनों पूर्वधारणाएँ I और II अंतर्निहित हैं","d":"न तो I और न ही II अंतर्निहित है"}'::jsonb, 'c', 'The rationale is environmental and financial benefit (I), and the execution assumes technical feasibility of space (II). Both are implicit.', 'सोलर पैनल लगाने का उद्देश्य ऊर्जा बचत व पर्यावरण संरक्षण है (I) और स्टेशनों पर इसे लगाने योग्य स्थान उपलब्ध है (II)। दोनों अंतर्निहित हैं।'),
  ('rrb_cbt_mock_1', 62, 3, 'PART-3', 'General Intelligence & Reasoning', '', 'Moderate', 'Read the statement and determine which assumption(s) is/are implicit:
Statement: ''Indian Railways has deployed the indigenous automatic train protection (ATP) system Kavach across critical high-density railway corridors.''
Assumptions:
I. Kavach can significantly minimize the risk of collisions caused by signal passing at danger (SPAD).
II. Indian Railways aims to elevate operational passenger safety to international benchmarks.', 'कथन को पढ़ें और तय करें कि कौन-सी धारणा/धारणाएं अंतर्निहित है/हैं:
कथन: ''भारतीय रेल ने महत्वपूर्ण उच्च घनत्व वाले रेल गलियारों में स्वदेशी स्वचालित ट्रेन सुरक्षा प्रणाली कवच (Kavach) को तैनात किया है।''
धारणाएं:
I. कवच खतरे में सिग्नल पार करने (SPAD) के कारण होने वाली ट्रेन टक्करों के जोखिम को काफी कम कर सकता है।
II. भारतीय रेल का लक्ष्य यात्री परिचालन सुरक्षा को अंतरराष्ट्रीय मानकों तक ले जाना है।', '{"a":"Both assumptions I and II are implicit","b":"Only assumption I is implicit","c":"Only assumption II is implicit","d":"Neither assumption I nor II is implicit"}'::jsonb, '{"a":"धारणा I और II दोनों अंतर्निहित हैं","b":"केवल धारणा I अंतर्निहित है","c":"केवल धारणा II अंतर्निहित है","d":"न तो धारणा I और न ही II अंतर्निहित है"}'::jsonb, 'a', 'The deployment of Kavach is explicitly aimed at preventing collisions from SPAD (Assumption I is implicit), and upgrading high-density corridors reflects the institutional goal to achieve high safety standards (Assumption II is implicit).', 'कवच का उद्देश्य स्वचालित ब्रेक लगाकर सिग्नल पासिंग एट डेंजर से होने वाली दुर्घटनाओं को रोकना है (धारणा I अंतर्निहित है) तथा संरक्षा को उच्च स्तर पर ले जाना रेलवे की मंशा है (धारणा II अंतर्निहित है)।'),
  ('rrb_cbt_mock_1', 63, 3, 'PART-3', 'General Intelligence & Reasoning', '', 'Moderate', 'How many total triangles are formed inside a square when both its diagonals and one horizontal median line dividing it into two equal halves are drawn?', 'एक वर्ग के दोनों विकर्णों तथा उसे दो बराबर भागों में विभाजित करने वाली एक क्षैतिज माध्य रेखा खींचने पर उसके अंदर कुल कितने त्रिभुज बनते हैं?', '{"a":"10","b":"12","c":"14","d":"16"}'::jsonb, '{"a":"10","b":"12","c":"14","d":"16"}'::jsonb, 'b', 'Breakdown of triangles:
- Small triangular segments formed by diagonals and horizontal median = 6 small triangles.
- Triangles made of 2 segments = 4.
- Large triangles formed by main diagonals = 2.
Total = 6 + 4 + 2 = 12 triangles.

Correct Option: (b)', 'त्रिभुजों की कुल संख्या:
- छोटे त्रिभुज = 6
- दो भागों से मिलकर बने त्रिभुज = 4
- मुख्य विकर्णों से बने बड़े त्रिभुज = 2
कुल = 6 + 4 + 2 = 12 त्रिभुज।

अतः सही उत्तर (b) है।'),
  ('rrb_cbt_mock_1', 64, 3, 'PART-3', 'General Intelligence & Reasoning', '', 'Moderate', '''Ophthalmologist'' is related to ''Eyes'' in the same way as ''Nephrologist'' is related to:', '''नेत्र रोग विशेषज्ञ'' (Ophthalmologist) का संबंध ''आँखों'' से उसी प्रकार है, जिस प्रकार ''नेफ्रोलॉजिस्ट'' (Nephrologist) का संबंध किससे है?', '{"a":"Heart","b":"Kidneys","c":"Brain","d":"Lungs"}'::jsonb, '{"a":"हृदय","b":"वृक्क (Kidneys)","c":"मस्तिष्क","d":"फेफड़े"}'::jsonb, 'b', 'An Ophthalmologist specializes in the diagnosis and treatment of eye disorders. A Nephrologist specializes in kidney care and renal diseases.

Correct Option: (b)', 'नेत्र रोग विशेषज्ञ आँखों के उपचार के विशेषज्ञ होते हैं। इसी प्रकार, नेफ्रोलॉजिस्ट गुर्दे/वृक्क (Kidneys) से संबंधित रोगों के विशेषज्ञ होते हैं।

अतः सही उत्तर (b) है।'),
  ('rrb_cbt_mock_1', 65, 3, 'PART-3', 'General Intelligence & Reasoning', '', 'Moderate', 'Starting from point P, Sachin walks 20 metres South. He turns left and walks 30 metres. He then turns left and walks 20 metres. Finally, he turns left once more and walks 40 metres to stop at point Q. How far and in which direction is point Q from point P?', 'बिंदु P से शुरू होकर, सचिन 20 मीटर दक्षिण की ओर चलता है। वह बायें मुड़ता है और 30 मीटर चलता है। फिर वह बायें मुड़कर 20 मीटर चलता है। अंत में, वह पुनः बायें मुड़ता है और बिंदु Q पर रुकने के लिए 40 मीटर चलता है। बिंदु Q, बिंदु P से कितनी दूर और किस दिशा में है?', '{"a":"10 metres West","b":"10 metres East","c":"20 metres West","d":"10 metres North"}'::jsonb, '{"a":"10 मीटर पश्चिम","b":"10 मीटर पूर्व","c":"20 मीटर पश्चिम","d":"10 मीटर उत्तर"}'::jsonb, 'a', 'Tracking coordinates from P(0, 0):
1. 20 m South -> (0, -20)
2. Turns left (East) 30 m -> (30, -20)
3. Turns left (North) 20 m -> (30, 0)
4. Turns left (West) 40 m -> (30 - 40, 0) = (-10, 0).
Point Q is at (-10, 0), which is exactly 10 metres West of P.

Correct Option: (a)', 'निर्देशांक विश्लेषण P(0,0) से:
1. दक्षिण 20 मी -> (0, -20)
2. बायें (पूर्व) 30 मी -> (30, -20)
3. बायें (उत्तर) 20 मी -> (30, 0)
4. बायें (पश्चिम) 40 मी -> (-10, 0)।
अतः Q, बिंदु P से 10 मीटर पश्चिम में है।

अतः सही उत्तर (a) है।'),
  ('rrb_cbt_mock_1', 66, 3, 'PART-3', 'General Intelligence & Reasoning', '', 'Moderate', 'Six persons A, B, C, D, E, and F are sitting around a circular table facing the centre. B is between A and C. E is between D and F. D is to the immediate left of A. Who is sitting opposite to B?', 'छह व्यक्ति A, B, C, D, E और F केंद्र की ओर मुख करके एक वृत्ताकार मेज के चारों ओर बैठे हैं। B, A और C के बीच में है। E, D और F के बीच में है। D, A के ठीक बायें है। B के विपरीत कौन बैठा है?', '{"a":"E","b":"D","c":"F","d":"C"}'::jsonb, '{"a":"E","b":"D","c":"F","d":"C"}'::jsonb, 'a', 'Placing in circular order facing centre (clockwise):
- Let A be at position 1.
- D is immediate left of A (clockwise) -> D is at position 2.
- E is between D and F -> E is at position 3, F is at position 4.
- B is between A and C -> C is at position 5, B is at position 6.
Opposite pairs in 6-person circle (pos i is opposite pos i+3):
- Position 6 (B) is opposite Position 3 (E).
Thus, E is sitting opposite to B.

Correct Option: (a)', 'वृत्ताकार व्यवस्था (केंद्रोन्मुख):
क्रमशः स्थिति: A(1) - D(2) - E(3) - F(4) - C(5) - B(6).
6 व्यक्तियों की मेज में आमने-सामने की स्थितियां (1-4, 2-5, 3-6) होती हैं।
अतः B के विपरीत E बैठा है।

अतः सही उत्तर (a) है।'),
  ('rrb_cbt_mock_1', 67, 3, 'PART-3', 'General Intelligence & Reasoning', '', 'Moderate', 'Select the odd number from the given set of options:
(a) 125  (b) 343  (c) 729  (d) 512', 'दिए गए विकल्पों में से विषम संख्या का चयन कीजिए:
(a) 125  (b) 343  (c) 729  (d) 512', '{"a":"125","b":"343","c":"729","d":"512"}'::jsonb, '{"a":"125","b":"343","c":"729","d":"512"}'::jsonb, 'c', 'Cube analysis:
- 125 = 5³
- 343 = 7³
- 512 = 8³
- 729 = 9³ = 27²
729 is the only number that is both a perfect square (27²) and a perfect cube (9³).

Correct Option: (c)', '125 (5³), 343 (7³), और 512 (8³) केवल पूर्ण घन हैं। जबकि 729 एक पूर्ण घन (9³) होने के साथ-साथ एक पूर्ण वर्ग (27²) भी है।

अतः सही उत्तर (c) है।'),
  ('rrb_cbt_mock_1', 68, 3, 'PART-3', 'General Intelligence & Reasoning', '', 'Moderate', 'In a certain code, ''TEACHER'' is written as ''VGCEJGT''. How will ''STUDENT'' be written in that code language?', 'एक निश्चित कूट में, ''TEACHER'' को ''VGCEJGT'' लिखा जाता है। उसी कूट भाषा में ''STUDENT'' को कैसे लिखा जाएगा?', '{"a":"UVWFGPV","b":"UVWGFPV","c":"UWVFGVP","d":"TUVEFOS"}'::jsonb, '{"a":"UVWFGPV","b":"UVWGFPV","c":"UWVFGVP","d":"TUVEFOS"}'::jsonb, 'a', 'Pattern: Forward shift of +2 for every letter:
T(+2)=V, E(+2)=G, A(+2)=C, C(+2)=E, H(+2)=J, E(+2)=G, R(+2)=T.
Applying to STUDENT:
S(19)+2 = U(21)
T(20)+2 = V(22)
U(21)+2 = W(23)
D(4)+2 = F(6)
E(5)+2 = G(7)
N(14)+2 = P(16)
T(20)+2 = V(22)
Result = UVWFGPV.

Correct Option: (a)', 'प्रत्येक अक्षर में +2 का अग्रिम विस्थापन:
S+2=U, T+2=V, U+2=W, D+2=F, E+2=G, N+2=P, T+2=V.
अतः अभीष्ट कूट UVWFGPV है।

अतः सही उत्तर (a) है।'),
  ('rrb_cbt_mock_1', 69, 3, 'PART-3', 'General Intelligence & Reasoning', '', 'Moderate', 'Statements:
1. Some doctors are teachers.
2. All teachers are researchers.
Conclusions:
I. Some researchers are doctors.
II. Some teachers are not doctors.', 'कथन:
1. कुछ डॉक्टर शिक्षक हैं।
2. सभी शिक्षक शोधकर्ता हैं।
निष्कर्ष:
I. कुछ शोधकर्ता डॉक्टर हैं।
II. कुछ शिक्षक डॉक्टर नहीं हैं।', '{"a":"Only conclusion I follows","b":"Only conclusion II follows","c":"Both follow","d":"Neither follows"}'::jsonb, '{"a":"केवल निष्कर्ष I अनुसरण करता है","b":"केवल निष्कर्ष II अनुसरण करता है","c":"दोनों अनुसरण करते हैं","d":"कोई अनुसरण नहीं करता"}'::jsonb, 'a', 'Since some doctors are teachers and all teachers are researchers, the intersection of Doctors and Teachers is completely contained in Researchers. Therefore, ''Some researchers are doctors'' is definitely true. However, from positive premises, a negative conclusion (''Some teachers are not doctors'') cannot be definitively deduced. Hence, only conclusion I follows.

Correct Option: (a)', 'चूँकि कुछ डॉक्टर शिक्षक हैं और सभी शिक्षक शोधकर्ता हैं, अतः शोधकर्ताओं और डॉक्टरों में सामान्य भाग अवश्य है (निष्कर्ष I सत्य)। सकारात्मक कथनों से नकारात्मक निष्कर्ष (निष्कर्ष II) निश्चित रूप से नहीं निकाला जा सकता। अतः केवल निष्कर्ष I अनुसरण करता है।

अतः सही उत्तर (a) है।'),
  ('rrb_cbt_mock_1', 70, 3, 'PART-3', 'General Intelligence & Reasoning', '', 'Moderate', 'If signs ''+'' and ''-'' and digits ''4'' and ''8'' are interchanged, which of the following equations becomes correct?', 'यदि चिन्हों ''+'' और ''-'' तथा अंकों ''4'' और ''8'' को परस्पर बदल दिया जाए, तो निम्नलिखित में से कौन सा समीकरण सही हो जाएगा?', '{"a":"4 - 8 + 12 = 0","b":"8 - 4 + 12 = 8","c":"4 + 8 - 12 = 16","d":"8 + 4 - 6 = 2"}'::jsonb, '{"a":"4 - 8 + 12 = 0","b":"8 - 4 + 12 = 8","c":"4 + 8 - 12 = 16","d":"8 + 4 - 6 = 2"}'::jsonb, 'a', 'Testing option (a): Original: 4 - 8 + 12 = 0
Interchange 4 ↔ 8 and - ↔ +:
8 + 4 - 12
= 12 - 12 = 0. This is perfectly correct!

Correct Option: (a)', 'विकल्प (a) में प्रतिस्थापन करने पर:
4 - 8 + 12 = 0
4 और 8 तथा + और - को बदलने पर:
8 + 4 - 12 = 12 - 12 = 0 (सत्य)।

अतः सही उत्तर (a) है।'),
  ('rrb_cbt_mock_1', 71, 3, 'PART-3', 'General Intelligence & Reasoning', '', 'Moderate', 'Find the missing number in the following sequence:
5, 13, 29, 61, 125, ?', 'निम्नलिखित अनुक्रम में लुप्त संख्या ज्ञात कीजिए:
5, 13, 29, 61, 125, ?', '{"a":"251","b":"253","c":"257","d":"249"}'::jsonb, '{"a":"251","b":"253","c":"257","d":"249"}'::jsonb, 'b', 'Pattern: Multiply by 2 and add 3:
- 5 × 2 + 3 = 13
- 13 × 2 + 3 = 29
- 29 × 2 + 3 = 61
- 61 × 2 + 3 = 125
- 125 × 2 + 3 = 250 + 3 = 253.

Correct Option: (b)', 'पैटर्न: संख्या × 2 + 3
5×2+3=13, 13×2+3=29, 29×2+3=61, 61×2+3=125, 125×2+3 = 253.

अतः सही उत्तर (b) है।'),
  ('rrb_cbt_mock_1', 72, 3, 'PART-3', 'General Intelligence & Reasoning', '', 'Moderate', 'If ''DELHI'' is coded as 73541 and ''CALCUTTA'' is coded as 82589662, how is ''CALICUT'' coded in that language?', 'यदि ''DELHI'' को 73541 और ''CALCUTTA'' को 82589662 के रूप में कूटबद्ध किया जाता है, तो ''CALICUT'' को कैसे कूटबद्ध किया जाएगा?', '{"a":"8251896","b":"8251869","c":"8258196","d":"8251986"}'::jsonb, '{"a":"8251896","b":"8251869","c":"8258196","d":"8251986"}'::jsonb, 'a', 'Direct letter mapping:
C=8, A=2, L=5, H=4, I=1, U=9, T=6.
For ''CALICUT'':
C -> 8
A -> 2
L -> 5
I -> 1
C -> 8
U -> 9
T -> 6
Code = 8251896.

Correct Option: (a)', 'प्रत्यक्ष कूट मिलान:
C=8, A=2, L=5, I=1, C=8, U=9, T=6.
अतः ''CALICUT'' = 8251896.

अतः सही उत्तर (a) है।'),
  ('rrb_cbt_mock_1', 73, 3, 'PART-3', 'General Intelligence & Reasoning', '', 'Moderate', 'Statements:
1. All stones are hammers.
2. No hammer is a ring.
Conclusions:
I. No stone is a ring.
II. Some rings are stones.', 'कथन:
1. सभी पत्थर हथौड़े हैं।
2. कोई हथौड़ा अंगूठी नहीं है।
निष्कर्ष:
I. कोई पत्थर अंगूठी नहीं है।
II. कुछ अंगूठियां पत्थर हैं।', '{"a":"Only conclusion I follows","b":"Only conclusion II follows","c":"Either I or II follows","d":"Neither follows"}'::jsonb, '{"a":"केवल निष्कर्ष I अनुसरण करता है","b":"केवल निष्कर्ष II अनुसरण करता है","c":"या तो I या II अनुसरण करता है","d":"कोई अनुसरण नहीं करता"}'::jsonb, 'a', 'Since All Stones are inside Hammers, and Hammers have zero intersection with Rings, Stones also have zero intersection with Rings. Therefore, ''No stone is a ring'' is definitely true. Conclusion II is false.

Correct Option: (a)', 'चूँकि सभी पत्थर हथौड़े हैं और हथौड़ों का अंगूठियों से कोई संबंध नहीं है, अतः पत्थरों का भी अंगूठियों से कोई संबंध नहीं हो सकता। निष्कर्ष I पूर्णतः सत्य है।

अतः सही उत्तर (a) है।'),
  ('rrb_cbt_mock_1', 74, 3, 'PART-3', 'General Intelligence & Reasoning', '', 'Moderate', 'At what time between 7 o''clock and 8 o''clock are the hands of a clock at right angles (90°) to each other for the first time?', '7 और 8 बजे के बीच किस समय पहली बार घड़ी की दोनों सुइयां एक दूसरे से समकोण (90°) पर होंगी?', '{"a":"7 hours 21 9/11 minutes","b":"7 hours 20 minutes","c":"7 hours 22 minutes","d":"7 hours 24 6/11 minutes"}'::jsonb, '{"a":"7 बजकर 21 9/11 मिनट","b":"7 बजकर 20 मिनट","c":"7 बजकर 22 मिनट","d":"7 बजकर 24 6/11 मिनट"}'::jsonb, 'a', 'At 7 o''clock, the minute hand is 35 minute spaces behind the hour hand.
For hands to be at right angle (15 minute spaces apart) for the first time, the minute hand must gain (35 - 15) = 20 minute spaces.
Time required = 20 × (60 / 55) = 20 × (12 / 11) = 240 / 11 = 21 9/11 minutes past 7.

Correct Option: (a)', '7 बजे दोनों सुइयों के बीच 35 मिनट की दूरी होती है। समकोण (15 मिनट की दूरी) के लिए मिनट की सुई को 35 - 15 = 20 मिनट की दूरी तय करनी होगी।
समय = 20 × (12 / 11) = 240 / 11 = 21 9/11 मिनट (7 बजकर 21 9/11 मिनट)।

अतः सही उत्तर (a) है।'),
  ('rrb_cbt_mock_1', 75, 3, 'PART-3', 'General Intelligence & Reasoning', '', 'Moderate', 'What letter-pair will continue the series:
CX, EV, GT, IR, ?', 'कौन सा अक्षर-युग्म श्रृंखला को आगे बढ़ाएगा:
CX, EV, GT, IR, ?', '{"a":"KP","b":"LO","c":"JQ","d":"KQ"}'::jsonb, '{"a":"KP","b":"LO","c":"JQ","d":"KQ"}'::jsonb, 'a', '1. First letters advance by +2: C(3) -> E(5) -> G(7) -> I(9) -> K(11).
2. Second letter is the opposite alphabet letter (sum of positions = 27):
Opposite of K(11) is P(16) [27 - 11 = 16].
Result = KP.

Correct Option: (a)', 'पहला अक्षर +2 से आगे बढ़ता है: C -> E -> G -> I -> K.
दूसरा अक्षर विपरीत अक्षर है: K का विपरीत P होता है (KP)।

अतः सही उत्तर (a) है।'),
  ('rrb_cbt_mock_1', 76, 3, 'PART-3', 'General Intelligence & Reasoning', '', 'Moderate', 'Statements:
1. All cups are plates.
2. Some plates are bowls.
Conclusions:
I. Some bowls are cups.
II. Some plates are cups.', 'कथन:
1. सभी कप प्लेट हैं।
2. कुछ प्लेट कटोरे हैं।
निष्कर्ष:
I. कुछ कटोरे कप हैं।
II. कुछ प्लेट कप हैं।', '{"a":"Only conclusion I follows","b":"Only conclusion II follows","c":"Both follow","d":"Neither follows"}'::jsonb, '{"a":"केवल निष्कर्ष I अनुसरण करता है","b":"केवल निष्कर्ष II अनुसरण करता है","c":"दोनों अनुसरण करते हैं","d":"कोई अनुसरण नहीं करता"}'::jsonb, 'b', 'All cups are inside plates (Cups ⊂ Plates). Therefore, Some plates are definitely cups (Conclusion II is valid). But bowls only overlap with plates, not necessarily with cups. Hence, only conclusion II follows.

Correct Option: (b)', 'चूँकि सभी कप प्लेट हैं, अतः कुछ प्लेट निश्चित रूप से कप हैं (निष्कर्ष II सत्य)। कटोरों का कप से सीधा संबंध अनिवार्य नहीं है। अतः केवल निष्कर्ष II अनुसरण करता है।

अतः सही उत्तर (b) है।'),
  ('rrb_cbt_mock_1', 77, 3, 'PART-3', 'General Intelligence & Reasoning', '', 'Moderate', 'Six persons U, V, W, X, Y, and Z are sitting in a row facing North. W is sitting between V and Y. X is sitting between U and Z. U is to the immediate left of V. Z is at the extreme right end. Who is sitting at the extreme left end?', 'छह व्यक्ति U, V, W, X, Y, और Z उत्तर की ओर मुख करके एक पंक्ति में बैठे हैं। W, V और Y के बीच बैठा है। X, U और Z के बीच बैठा है। U, V के ठीक बायें है। Z एकदम दायें छोर पर बैठा है। एकदम बायें छोर पर कौन बैठा है?', '{"a":"Y","b":"V","c":"W","d":"U"}'::jsonb, '{"a":"Y","b":"V","c":"W","d":"U"}'::jsonb, 'a', 'Arrangement deduction:
- Z is at position 6 (extreme right).
- X is between U and Z => X is at position 5, U is at position 4.
- U is to the immediate left of V => V is at position 3 (wait, if facing North, left of V is U, so U is pos 3, V is pos 4).
Let''s check: Y - W - V - U - X - Z:
- W is between Y and V.
- U is to the left of X, and X is between U and Z.
- Extreme left is Y.

Correct Option: (a)', 'बैठक व्यवस्था (बायें से दायें):
Y - W - V - U - X - Z.
अतः एकदम बायें छोर पर Y बैठा है।

अतः सही उत्तर (a) है।'),
  ('rrb_cbt_mock_1', 78, 3, 'PART-3', 'General Intelligence & Reasoning', '', 'Moderate', 'Find the next letter cluster in the series:
BCE, EGI, HLM, ?, NVA', 'दी गई अक्षर श्रृंखला में अगला पद ज्ञात कीजिए:
BCE, EGI, HLM, ?, NVA', '{"a":"KPR","b":"KPQ","c":"KQV","d":"KQS"}'::jsonb, '{"a":"KPR","b":"KPQ","c":"KQV","d":"KQS"}'::jsonb, 'd', 'Look at each letter''s positional value:
1st letters: B(2) + 3 = E(5) + 3 = H(8) + 3 = K(11) [+ 3 = N(14)]
2nd letters: C(3) + 4 = G(7) + 5 = L(12) + 5 = Q(17) [+ 5 = V(22)] -> Here step is +4, +5, +5, +5? Or look at gaps: C(3) to G(7) is +4, G(7) to L(12) is +5, L(12) to Q(17) is +5, Q(17) to V(22) is +5.
3rd letters: E(5) + 4 = I(9) + 4 = M(13) + 6 = S(19) [+ 8 = 27 = A].
Let''s check KQS: K=11, Q=17, S=19. Matches cleanly.

Correct Option: (d)', 'अक्षरों के मानों का विश्लेषण:
प्रथम अक्षर: B(+3) -> E(+3) -> H(+3) -> K(+3) -> N
द्वितीय अक्षर: C(3) -> G(7) -> L(12) -> Q(17) -> V(22)
तृतीय अक्षर: E(5) -> I(9) -> M(13) -> S(19) -> A(27)
अतः लुप्त पद ''KQS'' है।

अतः सही उत्तर (d) है।'),
  ('rrb_cbt_mock_1', 79, 3, 'PART-3', 'General Intelligence & Reasoning', '', 'Moderate', 'In a certain code language, ''ROBUST'' is written as ''QNATRS''. How will ''ZODIAC'' be written in that code language?', 'एक निश्चित कूट भाषा में ''ROBUST'' को ''QNATRS'' लिखा जाता है। उसी कूट भाषा में ''ZODIAC'' को कैसे लिखा जाएगा?', '{"a":"YNCHZB","b":"YNCGZB","c":"YNCHZA","d":"XNCHZB"}'::jsonb, '{"a":"YNCHZB","b":"YNCGZB","c":"YNCHZA","d":"XNCHZB"}'::jsonb, 'a', 'Each letter is shifted backward by 1 position (-1):
R - 1 = Q
O - 1 = N
B - 1 = A
U - 1 = T
S - 1 = R
T - 1 = S
Applying the same rule to ''ZODIAC'':
Z - 1 = Y
O - 1 = N
D - 1 = C
I - 1 = H
A - 1 = Z
C - 1 = B
Hence, ''YNCHZB''.

Correct Option: (a)', 'प्रत्येक अक्षर में से 1 घटाया गया है (-1):
R-1=Q, O-1=N, B-1=A, U-1=T, S-1=R, T-1=S
इसी प्रकार ''ZODIAC'' के लिए:
Z-1=Y, O-1=N, D-1=C, I-1=H, A-1=Z, C-1=B => ''YNCHZB''.

अतः सही उत्तर (a) है।'),
  ('rrb_cbt_mock_1', 80, 3, 'PART-3', 'General Intelligence & Reasoning', '', 'Moderate', 'Read the given statements and conclusions carefully. Assuming the statements are true, decide which of the given conclusions logically follows.
Statements:
1. All cars are vehicles.
2. Some vehicles are electric.
Conclusions:
I. Some electric items are cars.
II. Some vehicles are cars.', 'दिए गए कथनों और निष्कर्षों को ध्यानपूर्वक पढ़ें। कथनों को सत्य मानते हुए तय करें कि कौन सा निष्कर्ष तार्किक रूप से अनुसरण करता है।
कथन:
1. सभी कारें वाहन हैं।
2. कुछ वाहन इलेक्ट्रिक हैं।
निष्कर्ष:
I. कुछ इलेक्ट्रिक वस्तुएं कारें हैं।
II. कुछ वाहन कारें हैं।', '{"a":"Only conclusion I follows","b":"Only conclusion II follows","c":"Both conclusions I and II follow","d":"Neither conclusion I nor II follows"}'::jsonb, '{"a":"केवल निष्कर्ष I अनुसरण करता है","b":"केवल निष्कर्ष II अनुसरण करता है","c":"निष्कर्ष I और II दोनों अनुसरण करते हैं","d":"न तो निष्कर्ष I और न ही II अनुसरण करता है"}'::jsonb, 'b', 'Analysis:
- Statement 1: ''All cars are vehicles'' -> The car circle is entirely inside vehicles. This immediately implies ''Some vehicles are cars'' (Conclusion II is definitely TRUE).
- Statement 2: ''Some vehicles are electric'' -> Electric overlaps with vehicles, but not necessarily with cars. Thus, ''Some electric items are cars'' is not necessarily true (Conclusion I does not follow).
Hence, only conclusion II follows.

Correct Option: (b)', 'विश्लेषण:
1. कथन 1 से: ''सभी कारें वाहन हैं'', इसका अर्थ है कि ''कुछ वाहन अवश्य ही कारें हैं'' (निष्कर्ष II सत्य है)।
2. कथन 2 से: इलेक्ट्रिक का संबंध वाहन से है, कार से होना अनिवार्य नहीं है (निष्कर्ष I निश्चित नहीं है)।
अतः केवल निष्कर्ष II अनुसरण करता है।

अतः सही उत्तर (b) है।'),
  ('rrb_cbt_mock_1', 81, 4, 'PART-4', 'General Awareness & Current Affairs', '', 'Moderate', 'The Western Dedicated Freight Corridor (WDFC), designed for double-stack container freight operations, connects Dadri (Uttar Pradesh) to which major container terminal port in Maharashtra?', 'डबल-स्टैक कंटेनर माल ढुलाई के लिए डिज़ाइन किया गया पश्चिमी समर्पित माल गलियारा (WDFC), दादरी (उत्तर प्रदेश) को महाराष्ट्र के किस प्रमुख कंटेनर टर्मिनल बंदरगाह से जोड़ता है?', '{"a":"Jawaharlal Nehru Port Trust (JNPT / Nhava Sheva)","b":"Mormugao Port","c":"Kandla Port (Deendayal Port)","d":"Dhamra Port"}'::jsonb, '{"a":"जवाहरलाल नेहरू पोर्ट ट्रस्ट (JNPT / न्हावा शेवा)","b":"मोरमुगाओ बंदरगाह","c":"कांडला बंदरगाह (दीनदयाल पोर्ट)","d":"धामरा बंदरगाह"}'::jsonb, 'a', 'The Western Dedicated Freight Corridor (WDFC) spans $1,506\text{ km}$ from Dadri in Uttar Pradesh to Jawaharlal Nehru Port (JNPT) in Navi Mumbai, Maharashtra.', 'पश्चिमी समर्पित माल गलियारा (WDFC) $1,506\text{ किमी}$ लंबा है जो उत्तर प्रदेश के दादरी से नवी मुंबई के जवाहरलाल नेहरू पोर्ट (JNPT) तक विस्तृत है।'),
  ('rrb_cbt_mock_1', 82, 4, 'PART-4', 'General Awareness & Current Affairs', '', 'Moderate', 'Which strategic mountain pass in the Great Himalayas links Srinagar and the Kashmir Valley with Kargil and Leh on National Highway 1?', 'महान हिमालय में कौन-सा रणनीतिक पर्वतीय दर्रा राष्ट्रीय राजमार्ग 1 पर श्रीनगर और कश्मीर घाटी को कारगिल तथा लेह से जोड़ता है?', '{"a":"Zoji La Pass","b":"Nathu La Pass","c":"Rohtang Pass","d":"Shipki La Pass"}'::jsonb, '{"a":"ज़ोजिला दर्रा (Zoji La)","b":"नाथू ला दर्रा","c":"रोहतांग दर्रा","d":"शिपकी ला दर्रा"}'::jsonb, 'a', 'Zoji La Pass (altitude $3,528\text{ m}$) is a critical mountain pass connecting Srinagar with Ladakh. The all-weather Zojila Tunnel is being constructed beneath it.', 'ज़ोजिला दर्रा (ऊंचाई $3,528\text{ मीटर}$) श्रीनगर को कारगिल और लेह (लद्दाख) से जोड़ता है। इसके नीचे रणनीतिक ज़ोजिला सुरंग का निर्माण किया जा रहा है।'),
  ('rrb_cbt_mock_1', 83, 4, 'PART-4', 'General Awareness & Current Affairs', '', 'Moderate', 'What is the name of India''s first dedicated solar observatory space mission launched by ISRO in September 2023 to study the Sun?', 'सूर्य का अध्ययन करने के लिए सितंबर 2023 में इसरो (ISRO) द्वारा प्रक्षेपित भारत के पहले समर्पित सौर वेधशाला अंतरिक्ष मिशन का क्या नाम है?', '{"a":"Surya-1","b":"Aditya-L1","c":"Helios-India","d":"Solar-Probe X"}'::jsonb, '{"a":"सूर्य-1","b":"आदित्य-L1 (Aditya-L1)","c":"हीलियोस-इंडिया","d":"सोलर-प्रोब X"}'::jsonb, 'b', 'Aditya-L1 was launched by ISRO on 2 September 2023 using PSLV-C57 and placed in a halo orbit around the Sun-Earth Lagrangian point 1 (L1), approx 1.5 million km from Earth, to study solar coronal mass ejections.

Correct Option: (b)', 'इसरो ने 2 सितंबर 2023 को PSLV-C57 द्वारा आदित्य-L1 मिशन को सूर्य-पृथ्वी लैग्रेंजियन बिंदु 1 (L1) के चारों ओर हेलो कक्षा में सफलतापूर्वक स्थापित किया।

अतः सही उत्तर (b) है।'),
  ('rrb_cbt_mock_1', 84, 4, 'PART-4', 'General Awareness & Current Affairs', '', 'Moderate', 'What is the minimum age prescribed by the Constitution to be eligible for election as a member of the Lok Sabha?', 'लोकसभा सदस्य के रूप में चुनाव लड़ने के लिए संविधान द्वारा निर्धारित न्यूनतम आयु क्या है?', '{"a":"21 years","b":"25 years","c":"30 years","d":"35 years"}'::jsonb, '{"a":"21 वर्ष","b":"25 वर्ष","c":"30 वर्ष","d":"35 वर्ष"}'::jsonb, 'b', 'Under Article 84(b) of the Constitution of India, a person must be not less than 25 years of age to be qualified to be chosen as a member of the Lok Sabha (and not less than 30 years for Rajya Sabha).

Correct Option: (b)', 'अनुच्छेद 84(b) के अनुसार लोकसभा सदस्य बनने के लिए न्यूनतम आयु 25 वर्ष (और राज्यसभा के लिए 30 वर्ष) होनी चाहिए।

अतः सही उत्तर (b) है।'),
  ('rrb_cbt_mock_1', 85, 4, 'PART-4', 'General Awareness & Current Affairs', '', 'Moderate', 'What does Cash Reserve Ratio (CRR) mean in the context of Indian banking regulation?', 'भारतीय बैंकिंग विनियमन के संदर्भ में ''नकद आरक्षित अनुपात'' (CRR) का क्या अर्थ है?', '{"a":"The percentage of net deposits commercial banks must keep with themselves in gold","b":"The percentage of total Net Demand and Time Liabilities (NDTL) that commercial banks must maintain as liquid cash reserves with the RBI","c":"The rate at which banks advance loans to farmers","d":"The minimum capital adequacy ratio of foreign banks"}'::jsonb, '{"a":"बैंकों द्वारा सोने के रूप में रखी जाने वाली जमा राशि","b":"कुल जमा (NDTL) का वह निश्चित प्रतिशत जो वाणिज्यिक बैंकों को नकद के रूप में RBI के पास रखना अनिवार्य होता है","c":"किसानों को दिए जाने वाले ऋण की ब्याज दर","d":"विदेशी बैंकों का न्यूनतम पूंजी पर्याप्तता अनुपात"}'::jsonb, 'b', 'CRR is the mandatory percentage of a bank''s Net Demand and Time Liabilities (NDTL) that must be maintained in cash with the Reserve Bank of India. RBI does not pay interest on CRR balances.

Correct Option: (b)', 'CRR वाणिज्यिक बैंकों की कुल जमा (NDTL) का वह अनुपात है जिसे उन्हें नकद रूप में भारतीय रिज़र्व बैंक (RBI) के पास सुरक्षित रखना होता है।

अतः सही उत्तर (b) है।'),
  ('rrb_cbt_mock_1', 86, 4, 'PART-4', 'General Awareness & Current Affairs', '', 'Moderate', 'The famous Jog Falls (Gersoppa Falls), one of the highest plunge waterfalls in India (253 m drop), is located on which river in Karnataka?', 'भारत के सबसे ऊँचे झरनों में से एक प्रसिद्ध जोग जलप्रपात (गेरसोप्पा), कर्नाटक में किस नदी पर स्थित है?', '{"a":"Kaveri River","b":"Sharavathi River","c":"Krishna River","d":"Tungabhadra River"}'::jsonb, '{"a":"कावेरी नदी","b":"शरावती नदी (Sharavathi River)","c":"कृष्णा नदी","d":"तुंगभद्रा नदी"}'::jsonb, 'b', 'Jog Falls (also called Gerosoppa or Mahatma Gandhi Falls) is located on the Sharavathi River in the Shimoga district of Karnataka, plunging 253 metres (830 ft) in four distinct cascades: Raja, Roarer, Rocket, and Rani.

Correct Option: (b)', 'जोग जलप्रपात (महात्मा गांधी जलप्रपात) कर्नाटक के शिमोगा जिले में शरावती नदी पर स्थित है, जिसकी ऊंचाई लगभग 253 मीटर है।

अतः सही उत्तर (b) है।'),
  ('rrb_cbt_mock_1', 87, 4, 'PART-4', 'General Awareness & Current Affairs', '', 'Moderate', 'Under which Article of the Constitution of India was the ''Right to Education'' (RTE) inserted as a Fundamental Right for children aged 6 to 14 years?', 'भारतीय संविधान के किस अनुच्छेद के तहत 6 से 14 वर्ष की आयु के बच्चों के लिए ''शिक्षा का अधिकार'' (RTE) एक मौलिक अधिकार के रूप में जोड़ा गया?', '{"a":"Article 19","b":"Article 21A","c":"Article 30","d":"Article 45"}'::jsonb, '{"a":"अनुच्छेद 19","b":"अनुच्छेद 21A","c":"अनुच्छेद 30","d":"अनुच्छेद 45"}'::jsonb, 'b', 'The 86th Constitutional Amendment Act, 2002 inserted Article 21A into the Constitution of India.
It mandates the State to provide free and compulsory education to all children aged 6 to 14 years as a Fundamental Right.

Correct Option: (b)', '86वें संविधान संशोधन अधिनियम, 2002 द्वारा भारतीय संविधान में अनुच्छेद 21A जोड़ा गया, जिसके तहत 6 से 14 वर्ष की आयु के सभी बच्चों के लिए मुफ्त और अनिवार्य शिक्षा को मौलिक अधिकार बनाया गया।

अतः सही उत्तर (b) है।'),
  ('rrb_cbt_mock_1', 88, 4, 'PART-4', 'General Awareness & Current Affairs', '', 'Moderate', 'India''s first passenger train ran between Bori Bunder (Bombay) and Thane on 16th April 1853 covering a distance of 34 km. Which Governor-General introduced railways in India?', 'भारत की पहली यात्री ट्रेन 16 अप्रैल 1853 को बोरी बंदर (बॉम्बे) और ठाणे के बीच 34 किमी की दूरी पर चली थी। भारत में रेलवे की शुरुआत किस गवर्नर-जनरल के कार्यकाल में हुई थी?', '{"a":"Lord Canning","b":"Lord Dalhousie","c":"Lord Curzon","d":"Lord William Bentinck"}'::jsonb, '{"a":"लॉर्ड कैनिंग","b":"लॉर्ड डलहौजी","c":"लॉर्ड कर्जन","d":"लॉर्ड विलियम बेंटिक"}'::jsonb, 'b', 'Lord Dalhousie (Governor-General of India from 1848 to 1856) is known as the ''Father of Indian Railways''. The first commercial passenger train was hauled by three steam locomotives—Sultan, Sahib, and Sindh—on 16 April 1853.

Correct Option: (b)', 'लॉर्ड डलहौजी को ''भारतीय रेलवे का जनक'' माना जाता है। उनके कार्यकाल में 16 अप्रैल 1853 को पहली यात्री रेल बोरी बंदर से ठाणे के बीच 34 किमी की दूरी पर 3 इंजनों (सुल्तान, साहिब और सिंध) द्वारा चलाई गई थी।

अतः सही उत्तर (b) है।'),
  ('rrb_cbt_mock_1', 89, 4, 'PART-4', 'General Awareness & Current Affairs', '', 'Moderate', 'India''s indigenous semi-high speed train, Vande Bharat Express (initially known as Train 18), was designed and manufactured by which Indian Railways production unit?', 'भारत की स्वदेशी सेमी-हाई स्पीड ट्रेन ''वंदे भारत एक्सप्रेस'' (शुरुआत में ट्रेन 18 के नाम से जानी गई) को भारतीय रेलवे की किस उत्पादन इकाई द्वारा डिजाइन और निर्मित किया गया था?', '{"a":"Chittaranjan Locomotive Works (CLW), Asansol","b":"Integral Coach Factory (ICF), Chennai","c":"Rail Coach Factory (RCF), Kapurthala","d":"Diesel Locomotive Works (DLW), Varanasi"}'::jsonb, '{"a":"चित्तरंजन लोकोमोटिव वर्क्स (CLW), आसनसोल","b":"सवारी डिब्बा कारखाना (ICF), चेन्नई","c":"रेल कोच फैक्ट्री (RCF), कपूरथला","d":"डीजल रेलइंजन कारखाना (DLW), वाराणसी"}'::jsonb, 'b', 'Vande Bharat Express (Train 18) was designed and manufactured by the Integral Coach Factory (ICF) at Perambur, Chennai under the ''Make in India'' initiative. The first Vande Bharat train was flagged off on February 15, 2019, between New Delhi and Varanasi.

Correct Option: (b)', 'वंदे भारत एक्सप्रेस (ट्रेन 18) को इंटीग्रल कोच फैक्ट्री (ICF), चेन्नई द्वारा ''मेक इन इंडिया'' पहल के तहत स्वदेशी रूप से डिजाइन और निर्मित किया गया था। पहली वंदे भारत ट्रेन 15 फरवरी 2019 को नई दिल्ली से वाराणसी के बीच शुरू की गई थी।

अतः सही उत्तर (b) है।'),
  ('rrb_cbt_mock_1', 90, 4, 'PART-4', 'General Awareness & Current Affairs', '', 'Moderate', 'Which railway station in India holds the Guinness World Record for having the world''s longest railway platform measuring 1,507 meters?', 'भारत का कौन सा रेलवे स्टेशन 1,507 मीटर लंबे विश्व के सबसे लंबे रेलवे प्लेटफॉर्म का गिनीज वर्ल्ड रिकॉर्ड रखता है?', '{"a":"Gorakhpur Junction (Uttar Pradesh)","b":"Shree Siddharoodha Swamiji Hubballi Junction (Karnataka)","c":"Kollam Junction (Kerala)","d":"Kharagpur Junction (West Bengal)"}'::jsonb, '{"a":"गोरखपुर जंक्शन (उत्तर प्रदेश)","b":"श्री सिद्धारूढ़ स्वामीजी हुबली जंक्शन (कर्नाटक)","c":"कोल्लम जंक्शन (केरल)","d":"खड़गपुर जंक्शन (पश्चिम बंगाल)"}'::jsonb, 'b', 'Platform No. 8 at Shree Siddharoodha Swamiji Hubballi Junction in Karnataka was recognized by the Guinness World Records in March 2023 as the longest railway platform in the world with a length of 1,507 meters (overtaking Gorakhpur''s 1,366 m platform).

Correct Option: (b)', 'कर्नाटक के श्री सिद्धारूढ़ स्वामीजी हुबली जंक्शन (Sss Hubballi) का प्लेटफॉर्म नंबर 8 (लंबाई 1,507 मीटर) आधिकारिक तौर पर दुनिया का सबसे लंबा रेलवे प्लेटफॉर्म है। इससे पहले यह रिकॉर्ड गोरखपुर जंक्शन (1,366 मीटर) के नाम था।

अतः सही उत्तर (b) है।'),
  ('rrb_cbt_mock_1', 91, 4, 'PART-4', 'General Awareness & Current Affairs', '', 'Moderate', 'On 3rd February 1925, India''s first electric passenger train ran between which two stations?', '3 फरवरी 1925 को भारत की पहली इलेक्ट्रिक पैसेंजर ट्रेन किन दो स्टेशनों के बीच चलाई गई थी?', '{"a":"Bombay VT (Victoria Terminus) to Kurla Harbour","b":"Howrah to Hooghly","c":"Delhi to Agra","d":"Madras to Arakkonam"}'::jsonb, '{"a":"बॉम्बे वीटी (विक्टोरिया टर्मिनस) से कुर्ला हार्बर","b":"हावड़ा से हुगली","c":"दिल्ली से आगरा","d":"मद्रास से अराक्कोणम"}'::jsonb, 'a', 'India''s first electric train was flagged off on 3rd February 1925 on the Harbour Line between Bombay VT (now Chhatrapati Shivaji Maharaj Terminus) and Kurla, using 1500 V DC overhead traction.

Correct Option: (a)', 'भारत की पहली विद्युत रेलगाड़ी 3 फरवरी 1925 को बॉम्बे वीटी (विक्टोरिया टर्मिनस) और कुर्ला हार्बर के बीच 1500 V DC सिस्टम पर चलाई गई थी।

अतः सही उत्तर (a) है।'),
  ('rrb_cbt_mock_1', 92, 4, 'PART-4', 'General Awareness & Current Affairs', '', 'Moderate', 'India''s Mars Orbiter Mission (MOM), popularly known as Mangalyaan, was launched on 5th November 2013 by ISRO using which workhorse launch vehicle?', 'भारतीय अंतरिक्ष अनुसंधान संगठन (ISRO) द्वारा 5 नवंबर 2013 को भारत का पहला मंगल अभियान ''मंगलयान'' (MOM) किस प्रक्षेपण यान द्वारा लॉन्च किया गया था?', '{"a":"PSLV-C25","b":"GSLV-Mk III","c":"PSLV-C11","d":"GSLV-F05"}'::jsonb, '{"a":"PSLV-C25","b":"GSLV-Mk III","c":"PSLV-C11","d":"GSLV-F05"}'::jsonb, 'a', 'Mangalyaan (Mars Orbiter Mission) was launched from Satish Dhawan Space Centre in Sriharikota on 5 November 2013 aboard the Polar Satellite Launch Vehicle PSLV-C25 (in its XL configuration). India became the first Asian nation to reach Martian orbit and the first in the world to do so in its maiden attempt.
(PSLV-C11 launched Chandrayaan-1).

Correct Option: (a)', 'मंगलयान (Mars Orbiter Mission) को 5 नवंबर 2013 को सतीश धवन अंतरिक्ष केंद्र, श्रीहरिकोटा से PSLV-C25 रॉकेट द्वारा प्रक्षेपित किया गया था। भारत अपने पहले ही प्रयास में मंगल की कक्षा में पहुंचने वाला विश्व का पहला देश बना था।

अतः सही उत्तर (a) है।'),
  ('rrb_cbt_mock_1', 93, 4, 'PART-4', 'General Awareness & Current Affairs', '', 'Moderate', 'At the Tokyo 2020 Olympics, Neeraj Chopra won India''s first-ever Olympic track and field gold medal in Javelin Throw with a distance of:', 'टोक्यो 2020 ओलंपिक में नीरज चोपड़ा ने भाला फेंक (Javelin Throw) में कितनी दूरी का थ्रो करके एथलेटिक्स में भारत का पहला ओलंपिक स्वर्ण पदक जीता था?', '{"a":"87.58 m","b":"86.48 m","c":"88.13 m","d":"89.94 m"}'::jsonb, '{"a":"87.58 मीटर","b":"86.48 मीटर","c":"88.13 मीटर","d":"89.94 मीटर"}'::jsonb, 'a', 'On 7 August 2021 at the Tokyo Olympic Games, Neeraj Chopra won the Gold Medal in Men''s Javelin Throw with a throw of 87.58 meters in his second attempt. He became the second Indian individual Olympic gold medalist after Abhinav Bindra (2008 Beijing).

Correct Option: (a)', '7 अगस्त 2021 को टोक्यो ओलंपिक में नीरज चोपड़ा ने अपने दूसरे प्रयास में 87.58 मीटर दूर भाला फेंककर भारत के लिए ऐतिहासिक स्वर्ण पदक जीता। इसी उपलक्ष्य में प्रतिवर्ष 7 अगस्त को ''राष्ट्रीय भाला फेंक दिवस'' मनाया जाता है।

अतः सही उत्तर (a) है।'),
  ('rrb_cbt_mock_1', 94, 4, 'PART-4', 'General Awareness & Current Affairs', '', 'Moderate', 'Which was the first operational rapid transit urban metro railway network in India, inaugurated on 24th October 1984?', '24 अक्टूबर 1984 को शुरू हुई भारत की पहली शहरी रैपिड ट्रांजिट ''मेट्रो रेलवे'' कौन सी थी?', '{"a":"Kolkata Metro","b":"Delhi Metro","c":"Namma Metro (Bengaluru)","d":"Mumbai Metro"}'::jsonb, '{"a":"कोलकाता मेट्रो","b":"दिल्ली मेट्रो","c":"नम्मा मेट्रो (बेंगलुरु)","d":"मुंबई मेट्रो"}'::jsonb, 'a', 'The Kolkata Metro was the first underground metro railway system in India. Commercial services commenced on 24 October 1984 between Esplanade and Bhowanipore (Netaji Bhavan) covering a distance of 3.4 km. In December 2010, it became the 17th Zone of Indian Railways.
(Delhi Metro started in 2002).

Correct Option: (a)', 'भारत की पहली मेट्रो रेल सेवा 24 अक्टूबर 1984 को कोलकाता में एस्प्लेनेड से भवानीपुर के बीच शुरू हुई थी। 2010 में कोलकाता मेट्रो को भारतीय रेलवे का 17वां जोन बनाया गया।
(दिल्ली मेट्रो 2002 में शुरू हुई थी)।

अतः सही उत्तर (a) है।'),
  ('rrb_cbt_mock_1', 95, 4, 'PART-4', 'General Awareness & Current Affairs', '', 'Moderate', 'Hirakud Dam, one of the longest major earthen dams in the world (about 25.8 km total length), is constructed across which river in Odisha?', 'दुनिया के सबसे लंबे बांधों में से एक ''हीराकुंड बांध'' (कुल लंबाई लगभग 25.8 किमी) ओडिशा में किस नदी पर बनाया गया है?', '{"a":"Mahanadi River","b":"Godavari River","c":"Brahmani River","d":"Subarnarekha River"}'::jsonb, '{"a":"महानदी (Mahanadi)","b":"गोदावरी नदी","c":"ब्राह्मणी नदी","d":"सुवर्णरेखा नदी"}'::jsonb, 'a', 'Hirakud Dam is built across the Mahanadi River near Sambalpur in Odisha. Commissioned in 1957, it is India''s first major multipurpose river valley project initiated after independence to control catastrophic floods in the Mahanadi delta.

Correct Option: (a)', 'हीराकुंड बांध ओडिशा के संबलपुर में महानदी पर निर्मित भारत का सबसे लंबा बांध है। यह स्वतंत्रता के बाद शुरू की गई पहली बहुउद्देशीय नदी घाटी परियोजनाओं में से एक है।

अतः सही उत्तर (a) है।'),
  ('rrb_cbt_mock_1', 96, 4, 'PART-4', 'General Awareness & Current Affairs', '', 'Moderate', 'Where is the Indian Railway Rail Wheel Factory (RWF) located?', 'भारतीय रेल का रेल पहिया कारखाना (Rail Wheel Factory - RWF) कहाँ स्थित है?', '{"a":"Yelahanka, Bengaluru","b":"Perambur, Chennai","c":"Varanasi, Uttar Pradesh","d":"Kapurthala, Punjab"}'::jsonb, '{"a":"येलाहंका, बेंगलुरु","b":"पेरम्बूर, चेन्नई","c":"वाराणसी, उत्तर प्रदेश","d":"कपूरथला, पंजाब"}'::jsonb, 'a', 'Rail Wheel Factory (RWF) is located at Yelahanka, Bengaluru, Karnataka. It manufactures railway wheels, axles, and wheel sets.', 'रेल पहिया कारखाना (RWF) येलाहंका, बेंगलुरु (कर्नाटक) में स्थित है। यह रेल पहियों, धुरों और पहिया सेटों का निर्माण करता है।'),
  ('rrb_cbt_mock_1', 97, 4, 'PART-4', 'General Awareness & Current Affairs', '', 'Moderate', 'What is the venue of the upcoming 2028 Summer Olympic Games?', 'आगामी 2028 ग्रीष्मकालीन ओलंपिक खेलों का आयोजन स्थल कौन सा है?', '{"a":"Brisbane, Australia","b":"Los Angeles, USA","c":"Tokyo, Japan","d":"London, UK"}'::jsonb, '{"a":"ब्रिसबेन, ऑस्ट्रेलिया","b":"लॉस एंजिल्स, यूएसए","c":"टोक्यो, जापान","d":"लंदन, यूके"}'::jsonb, 'b', 'The 2028 Summer Olympics (officially the Games of the XXXIV Olympiad) are scheduled to take place in Los Angeles, California, USA.', '2028 ग्रीष्मकालीन ओलंपिक (आधिकारिक रूप से 34वें ओलंपियाड खेल) लॉस एंजिल्स, कैलिफोर्निया (यूएसए) में आयोजित होने वाले हैं।'),
  ('rrb_cbt_mock_1', 98, 4, 'PART-4', 'General Awareness & Current Affairs', '', 'Moderate', 'What is the standard track gauge distance of the Broad Gauge (BG) in Indian Railways?', 'भारतीय रेल में ब्रॉड गेज (BG) की मानक ट्रैक गेज दूरी कितनी होती है?', '{"a":"1000 mm","b":"1676 mm","c":"1435 mm","d":"762 mm"}'::jsonb, '{"a":"1000 मिमी","b":"1676 मिमी","c":"1435 मिमी","d":"762 मिमी"}'::jsonb, 'b', 'Indian Broad Gauge track measures 1,676 mm (5 ft 6 in) between the inner faces of the two rails. Standard Gauge is 1,435 mm and Meter Gauge is 1,000 mm.', 'भारतीय ब्रॉड गेज ट्रैक की दोनों पटरियों के बीच की दूरी 1,676 मिमी (5 फीट 6 इंच) होती है। मानक गेज 1,435 मिमी और मीटर गेज 1,000 मिमी होता है।'),
  ('rrb_cbt_mock_1', 99, 4, 'PART-4', 'General Awareness & Current Affairs', '', 'Moderate', 'Fundamental Rights are enshrined in which Part of the Indian Constitution?', 'भारतीय संविधान के किस भाग में मौलिक अधिकार सन्निहित हैं?', '{"a":"Part II","b":"Part III","c":"Part IV","d":"Part IVA"}'::jsonb, '{"a":"भाग II","b":"भाग III","c":"भाग IV","d":"भाग IVA"}'::jsonb, 'b', 'Fundamental Rights are contained in Part III of the Indian Constitution from Article 12 to 35, often described as the Magna Carta of India.', 'मौलिक अधिकार भारतीय संविधान के भाग III (अनुच्छेद 12 से 35) में निहित हैं, जिसे भारत का मैग्ना कार्टा भी कहा जाता है।'),
  ('rrb_cbt_mock_1', 100, 4, 'PART-4', 'General Awareness & Current Affairs', '', 'Moderate', 'Who is globally recognized as the ''Father of the White Revolution'' (Operation Flood) in India?', 'भारत में ''श्वेत क्रांति'' (ऑपरेशन फ्लड) के जनक के रूप में किसे मान्यता प्राप्त है?', '{"a":"M.S. Swaminathan","b":"Dr. Verghese Kurien","c":"Norman Borlaug","d":"Sam Pitroda"}'::jsonb, '{"a":"एम.एस. स्वामीनाथन","b":"डॉ. वर्गीज कुरियन","c":"नॉर्मन बोरलॉग","d":"सैम पित्रोदा"}'::jsonb, 'b', 'Dr. Verghese Kurien is known as the Father of the White Revolution in India for creating the billion-litre cooperative dairy movement (Amul / Operation Flood).', 'डॉ. वर्गीज कुरियन को भारत में श्वेत क्रांति (ऑपरेशन फ्लड) का जनक माना जाता है, जिन्होंने अमूल सहकारी डेयरी मॉडल की स्थापना की।');

-- Verification
SELECT count(*) AS total_rrb_mock_1_questions_seeded FROM public.questions WHERE test_id = 'rrb_cbt_mock_1';
