import pytest
from playwright.sync_api import Page, expect

from .test_auth import UNIQUE_EMAIL

@pytest.mark.dependency(depends=["test_successful_login"])
def test_bread_workflow_for_calculations(page: Page):
    page.goto("http://localhost:8000/static/login.html")
    page.get_by_label("Email:").fill(UNIQUE_EMAIL)
    page.get_by_label("Password:").fill("password123")
    page.get_by_role("button", name="Login").click()
    
    expect(page).to_have_url("http://localhost:8000/static/calculations.html")
    expect(page.get_by_role("heading", name="My Calculations")).to_be_visible()
    page.get_by_placeholder("Value A").fill("3")
    page.get_by_placeholder("Value B").fill("4")
    page.get_by_role("combobox").select_option("exponentiate")
    page.get_by_role("button", name="Save Calculation").click()

    list_item = page.locator("#calcList li").first
    expect(list_item).to_contain_text("3 ^ 4 = 81.00")

    list_item.get_by_role("button", name="Edit").click()

    expect(page.get_by_placeholder("Value A")).to_have_value("3")
    
    page.get_by_placeholder("Value A").fill("10")
    page.get_by_placeholder("Value B").fill("5")
    page.get_by_role("combobox").select_option("subtract")
    page.get_by_role("button", name="Save Calculation").click()

    expect(list_item).to_contain_text("10 - 5 = 5.00")

    page.on("dialog", lambda dialog: dialog.accept())
    list_item.get_by_role("button", name="Delete").click()
    
    expect(page.locator("#calcList li")).to_have_count(0)