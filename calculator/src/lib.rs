use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn calculate(expression: &str) -> Result<f64, JsValue> {
    meval::eval_str(expression)
        .map_err(|e| JsValue::from_str(&format!("Evaluation error: {}", e)))
}

Unit tests
#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_simple_calculation() {
        assert_eq!(calculate("2*2").unwrap(), 4.0);
    }
    
    #[test]
    fn test_complex_calculation() {
        assert_eq!(calculate("(5+3)/2").unwrap(), 4.0);
    }
}