#!/usr/bin/env python3
"""
KiloCode AI Rules Validation Script
Validates the completeness and structure of the AI rules configuration
"""

import os
import yaml
import sys
from pathlib import Path
from typing import Dict, List, Any

class RulesValidator:
    def __init__(self, rules_dir: str = None):
        if rules_dir is None:
            # Determine if we're running from within .ai-rules or from parent directory
            current_dir = Path.cwd()
            if current_dir.name == ".ai-rules":
                self.rules_dir = current_dir
            else:
                self.rules_dir = current_dir / ".ai-rules"
        else:
            self.rules_dir = Path(rules_dir)
        self.errors: List[str] = []
        self.warnings: List[str] = []
        
    def validate_all(self) -> bool:
        """Validate all rule files and structure"""
        print("🔍 Validating KiloCode AI Rules Structure...")
        print("=" * 50)
        
        # Check directory structure
        self.validate_directory_structure()
        
        # Validate individual files
        self.validate_core_rules()
        self.validate_communication_protocols()
        self.validate_development_workflows()
        self.validate_tool_usage_patterns()
        self.validate_security_accessibility()
        self.validate_performance_quality()
        self.validate_mode_configurations()
        self.validate_readme()
        
        # Report results
        self.report_results()
        
        return len(self.errors) == 0
    
    def validate_directory_structure(self):
        """Validate the rules directory structure"""
        print("📁 Checking directory structure...")
        
        if not self.rules_dir.exists():
            self.errors.append(f"Rules directory {self.rules_dir} does not exist")
            return
            
        required_files = [
            "kilocode-core-rules.yaml",
            "communication-protocols.yaml", 
            "development-workflows.yaml",
            "tool-usage-patterns.yaml",
            "security-accessibility.yaml",
            "performance-quality.yaml",
            "mode-configurations.yaml",
            "README.md"
        ]
        
        for file in required_files:
            file_path = self.rules_dir / file
            if not file_path.exists():
                self.errors.append(f"Required file missing: {file}")
            else:
                print(f"  ✅ {file}")
    
    def validate_yaml_file(self, filename: str, required_sections: List[str]) -> Dict[str, Any]:
        """Validate a YAML file and return its content"""
        file_path = self.rules_dir / filename
        
        if not file_path.exists():
            self.errors.append(f"File {filename} does not exist")
            return {}
            
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = yaml.safe_load(f)
                
            if not content:
                self.errors.append(f"File {filename} is empty or invalid YAML")
                return {}
                
            # Check required sections
            for section in required_sections:
                if section not in content:
                    self.errors.append(f"Missing required section '{section}' in {filename}")
                    
            return content
            
        except yaml.YAMLError as e:
            self.errors.append(f"YAML parsing error in {filename}: {e}")
            return {}
        except Exception as e:
            self.errors.append(f"Error reading {filename}: {e}")
            return {}
    
    def validate_core_rules(self):
        """Validate the core rules file"""
        print("🤖 Validating core rules...")
        
        required_sections = [
            "version", "agent", "maintainer", "identity",
            "programming_languages", "frameworks_and_tools",
            "code_standards", "architecture_patterns"
        ]
        
        content = self.validate_yaml_file("kilocode-core-rules.yaml", required_sections)
        
        if content:
            # Validate identity section
            if "identity" in content:
                identity = content["identity"]
                required_identity_fields = ["name", "role", "specialization", "personality"]
                for field in required_identity_fields:
                    if field not in identity:
                        self.warnings.append(f"Missing identity field: {field}")
            
            print("  ✅ Core rules structure validated")
    
    def validate_communication_protocols(self):
        """Validate communication protocols"""
        print("🗣️ Validating communication protocols...")
        
        required_sections = [
            "version", "scope", "communication_philosophy",
            "response_format", "question_response_strategy"
        ]
        
        content = self.validate_yaml_file("communication-protocols.yaml", required_sections)
        
        if content:
            print("  ✅ Communication protocols validated")
    
    def validate_development_workflows(self):
        """Validate development workflows"""
        print("⚙️ Validating development workflows...")
        
        required_sections = [
            "version", "scope", "project_creation_workflow",
            "feature_development_cycle", "debugging_methodology"
        ]
        
        content = self.validate_yaml_file("development-workflows.yaml", required_sections)
        
        if content:
            print("  ✅ Development workflows validated")
    
    def validate_tool_usage_patterns(self):
        """Validate tool usage patterns"""
        print("🛠️ Validating tool usage patterns...")
        
        required_sections = [
            "version", "scope", "file_operation_strategies",
            "system_operation_strategies", "development_cycle_optimization"
        ]
        
        content = self.validate_yaml_file("tool-usage-patterns.yaml", required_sections)
        
        if content:
            print("  ✅ Tool usage patterns validated")
    
    def validate_security_accessibility(self):
        """Validate security and accessibility standards"""
        print("🔐 Validating security & accessibility...")
        
        required_sections = [
            "version", "scope", "input_security_standards",
            "auth_security_standards", "accessibility_requirements"
        ]
        
        content = self.validate_yaml_file("security-accessibility.yaml", required_sections)
        
        if content:
            print("  ✅ Security & accessibility standards validated")
    
    def validate_performance_quality(self):
        """Validate performance and quality standards"""
        print("⚡ Validating performance & quality...")
        
        required_sections = [
            "version", "scope", "frontend_performance_targets",
            "backend_performance_targets", "quality_measurement_framework"
        ]
        
        content = self.validate_yaml_file("performance-quality.yaml", required_sections)
        
        if content:
            print("  ✅ Performance & quality standards validated")
    
    def validate_mode_configurations(self):
        """Validate mode-specific configurations"""
        print("🎭 Validating mode configurations...")
        
        required_sections = [
            "version", "scope", "code_mode_profile",
            "debug_mode_profile", "architect_mode_profile"
        ]
        
        content = self.validate_yaml_file("mode-configurations.yaml", required_sections)
        
        if content:
            print("  ✅ Mode configurations validated")
    
    def validate_readme(self):
        """Validate README documentation"""
        print("📚 Validating README documentation...")
        
        readme_path = self.rules_dir / "README.md"
        
        if not readme_path.exists():
            self.errors.append("README.md file missing")
            return
            
        try:
            with open(readme_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            required_sections = [
                "# 🤖 KiloCode AI Rules",
                "## 📋 Overview",
                "## 🗂️ Rules Structure",
                "## 🎯 Quick Reference Guide",
                "## 🛠️ Tool Usage Guidelines",
                "## 🔐 Security Standards",
                "## ♿ Accessibility Standards",
                "## ⚡ Performance Standards",
                "## 🏆 Quality Standards"
            ]
            
            for section in required_sections:
                if section not in content:
                    self.warnings.append(f"README missing section: {section}")
                    
            print("  ✅ README documentation validated")
            
        except Exception as e:
            self.errors.append(f"Error reading README.md: {e}")
    
    def report_results(self):
        """Report validation results"""
        print("\n" + "=" * 50)
        print("📊 VALIDATION RESULTS")
        print("=" * 50)
        
        if not self.errors and not self.warnings:
            print("🎉 All validations passed! Rules structure is complete and valid.")
            return
            
        if self.errors:
            print(f"❌ ERRORS ({len(self.errors)}):")
            for error in self.errors:
                print(f"  • {error}")
                
        if self.warnings:
            print(f"\n⚠️ WARNINGS ({len(self.warnings)}):")
            for warning in self.warnings:
                print(f"  • {warning}")
                
        if self.errors:
            print(f"\n💥 Validation failed with {len(self.errors)} errors.")
        else:
            print(f"\n✅ Validation passed with {len(self.warnings)} warnings.")

def main():
    """Main validation function"""
    validator = RulesValidator()
    success = validator.validate_all()
    
    if success:
        print("\n🚀 KiloCode AI Rules are ready for use!")
        sys.exit(0)
    else:
        print("\n🔧 Please fix the errors before using the rules.")
        sys.exit(1)

if __name__ == "__main__":
    main()