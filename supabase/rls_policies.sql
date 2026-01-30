-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_member_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE editals ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE broadcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_events ENABLE ROW LEVEL SECURITY;

-- =============================================
-- USER PROFILES POLICIES
-- =============================================

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
    ON user_profiles FOR SELECT
    USING (auth.uid() = id);

-- Users can update their own profile (except role and subscription fields)
CREATE POLICY "Users can update own profile"
    ON user_profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id AND
        role = (SELECT role FROM user_profiles WHERE id = auth.uid()) AND
        subscription_status = (SELECT subscription_status FROM user_profiles WHERE id = auth.uid())
    );

-- Admins can read all profiles
CREATE POLICY "Admins can read all profiles"
    ON user_profiles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Admins can update any profile
CREATE POLICY "Admins can update any profile"
    ON user_profiles FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- =============================================
-- PROJECTS POLICIES
-- =============================================

-- Users can read their own projects
CREATE POLICY "Users can read own projects"
    ON projects FOR SELECT
    USING (auth.uid() = user_id);

-- Paid users can create projects
CREATE POLICY "Paid users can create projects"
    ON projects FOR INSERT
    WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() 
            AND (role = 'paid_user' OR role = 'admin')
            AND subscription_status = 'active'
        )
    );

-- Users can update their own projects
CREATE POLICY "Users can update own projects"
    ON projects FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can delete their own projects
CREATE POLICY "Users can delete own projects"
    ON projects FOR DELETE
    USING (auth.uid() = user_id);

-- Admins can do everything with projects
CREATE POLICY "Admins can manage all projects"
    ON projects FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- =============================================
-- TEAM MEMBERS POLICIES
-- =============================================

-- Users can read their own team members
CREATE POLICY "Users can read own team members"
    ON team_members FOR SELECT
    USING (auth.uid() = user_id);

-- Paid users can create team members (max 100 enforced by constraint)
CREATE POLICY "Paid users can create team members"
    ON team_members FOR INSERT
    WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() 
            AND (role = 'paid_user' OR role = 'admin')
            AND subscription_status = 'active'
        )
    );

-- Users can update their own team members
CREATE POLICY "Users can update own team members"
    ON team_members FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can delete their own team members
CREATE POLICY "Users can delete own team members"
    ON team_members FOR DELETE
    USING (auth.uid() = user_id);

-- =============================================
-- TEAM MEMBER ROLES POLICIES
-- =============================================

-- Users can read roles for their team members
CREATE POLICY "Users can read own team member roles"
    ON team_member_roles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM team_members
            WHERE id = team_member_roles.team_member_id
            AND user_id = auth.uid()
        )
    );

-- Users can create roles for their team members
CREATE POLICY "Users can create team member roles"
    ON team_member_roles FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM team_members
            WHERE id = team_member_roles.team_member_id
            AND user_id = auth.uid()
        )
    );

-- Users can update roles for their team members
CREATE POLICY "Users can update team member roles"
    ON team_member_roles FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM team_members
            WHERE id = team_member_roles.team_member_id
            AND user_id = auth.uid()
        )
    );

-- Users can delete roles for their team members
CREATE POLICY "Users can delete team member roles"
    ON team_member_roles FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM team_members
            WHERE id = team_member_roles.team_member_id
            AND user_id = auth.uid()
        )
    );

-- =============================================
-- PROJECT ALLOCATIONS POLICIES
-- =============================================

-- Users can read allocations for their projects
CREATE POLICY "Users can read own project allocations"
    ON project_allocations FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM projects
            WHERE id = project_allocations.project_id
            AND user_id = auth.uid()
        )
    );

-- Users can create allocations for their projects
CREATE POLICY "Users can create project allocations"
    ON project_allocations FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects
            WHERE id = project_allocations.project_id
            AND user_id = auth.uid()
        )
    );

-- Users can update allocations for their projects
CREATE POLICY "Users can update project allocations"
    ON project_allocations FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM projects
            WHERE id = project_allocations.project_id
            AND user_id = auth.uid()
        )
    );

-- Users can delete allocations for their projects
CREATE POLICY "Users can delete project allocations"
    ON project_allocations FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM projects
            WHERE id = project_allocations.project_id
            AND user_id = auth.uid()
        )
    );

-- =============================================
-- EDITALS POLICIES
-- =============================================

-- All authenticated users can read active editals
CREATE POLICY "Authenticated users can read editals"
    ON editals FOR SELECT
    USING (auth.uid() IS NOT NULL);

-- Only admins can create editals
CREATE POLICY "Admins can create editals"
    ON editals FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Only admins can update editals
CREATE POLICY "Admins can update editals"
    ON editals FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Only admins can delete editals
CREATE POLICY "Admins can delete editals"
    ON editals FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- =============================================
-- PORTFOLIOS POLICIES
-- =============================================

-- Users can read their own portfolios
CREATE POLICY "Users can read own portfolios"
    ON portfolios FOR SELECT
    USING (auth.uid() = user_id);

-- Paid users can create portfolios
CREATE POLICY "Paid users can create portfolios"
    ON portfolios FOR INSERT
    WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() 
            AND (role = 'paid_user' OR role = 'admin')
            AND subscription_status = 'active'
        )
    );

-- Users can update their own portfolios
CREATE POLICY "Users can update own portfolios"
    ON portfolios FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can delete their own portfolios
CREATE POLICY "Users can delete own portfolios"
    ON portfolios FOR DELETE
    USING (auth.uid() = user_id);

-- =============================================
-- BROADCASTS POLICIES
-- =============================================

-- All authenticated users can read active broadcasts
CREATE POLICY "Authenticated users can read broadcasts"
    ON broadcasts FOR SELECT
    USING (
        auth.uid() IS NOT NULL AND
        active = TRUE AND
        (expires_at IS NULL OR expires_at > NOW())
    );

-- Only admins can create broadcasts
CREATE POLICY "Admins can create broadcasts"
    ON broadcasts FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Only admins can update broadcasts
CREATE POLICY "Admins can update broadcasts"
    ON broadcasts FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Only admins can delete broadcasts
CREATE POLICY "Admins can delete broadcasts"
    ON broadcasts FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- =============================================
-- SUBSCRIPTION EVENTS POLICIES
-- =============================================

-- Only admins can read subscription events
CREATE POLICY "Admins can read subscription events"
    ON subscription_events FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- No direct insert (only via backend webhook)
-- No update or delete policies (immutable log)
