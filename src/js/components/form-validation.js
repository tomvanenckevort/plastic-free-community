import 'govuk-frontend/vendor/polyfills/Element/prototype/classList';
import 'govuk-frontend/vendor/polyfills/Element/prototype/closest';
import common from 'govuk-frontend/common';

var errorMessageClass = 'govuk-error-message';
var errorFormGroupClass = 'govuk-form-group--error';
var formGroupClass = 'govuk-form-group';
var visuallyHiddenClass = 'govuk-visually-hidden';

function FormValidation($module) {
    this.$module = $module || document;
    this.$forms = this.$module.querySelectorAll('.js-app-form-validation');
}

FormValidation.prototype.bindUIEvents = function() {
    common.nodeListForEach(this.$forms, function($form) {
        $form.setAttribute('novalidate', '');

        $form.addEventListener('submit', function(e) {
            var isValid = true;

            // check for field validity
            var $fields = $form.querySelectorAll('input,textarea,select');

            common.nodeListForEach($fields, function($field) {
                var $formFieldGroup = $field.closest('.' + formGroupClass);

                if ($field.getAttribute('type') === 'radio' && !$field.closest('.govuk-radios__item').matches(':first-child')) {
                    // only check first radio element of the group
                    return;
                }

                // remove any old error message
                var errorMessageSpan = $formFieldGroup.querySelector('.' + errorMessageClass);
                if (errorMessageSpan) {
                    errorMessageSpan.parentNode.removeChild(errorMessageSpan);
                }

                if (!$field.checkValidity()) {
                    isValid = false;

                    // get error message from data attribute
                    var errorMessage = '';

                    for (var key in $field.validity) {
                        if ($field.validity[key] === true) {
                            errorMessage = $field.dataset[key];
                            break;
                        }
                    }

                    // add error message markup before the input field
                    var errorMessageSpan = document.createElement('span');
                    errorMessageSpan.classList.add(errorMessageClass);

                    var errorSpan = document.createElement('span');
                    errorSpan.classList.add(visuallyHiddenClass);
                    errorSpan.innerText = 'Error:';

                    var errorMessageText = document.createTextNode(errorMessage);

                    errorMessageSpan.appendChild(errorSpan);
                    errorMessageSpan.appendChild(errorMessageText);

                    var $label = $formFieldGroup.querySelector('label');
                    var $nextElement = $label.nextElementSibling;

                    if ($nextElement && $nextElement.classList.contains('govuk-hint')) {
                        // put error message after the field hint
                        $nextElement = $nextElement.nextElementSibling;
                    }

                    $label.parentNode.insertBefore(errorMessageSpan, $nextElement);

                    // mark the form field as invalid
                    $formFieldGroup.classList.add(errorFormGroupClass);
                } else {
                    // mark the form field as valid
                    $formFieldGroup.classList.remove(errorFormGroupClass);
                }
            });

            if (!isValid) {
                // don't submit invalid form
                e.preventDefault();
                return false;
            }
        });
    });
};

FormValidation.prototype.init = function() {
    // Since the Form validation is not included in IE8
    // We detect features we need to use only available in IE9+ https://caniuse.com/#feat=addeventlistener
    // http://responsivenews.co.uk/post/18948466399/cutting-the-mustard
    var featuresNeeded = 'querySelector' in document && 'addEventListener' in window;

    if (!featuresNeeded) {
        return;
    }

    this.bindUIEvents();
};

export default FormValidation;
